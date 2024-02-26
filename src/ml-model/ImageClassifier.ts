import {
  torch,
  torchvision,
  media,
  MobileModel,
  Image,
} from 'react-native-pytorch-core';
import * as FloresEfficientNetV2Classes from './Flores.json';
import {mapClassToLabel} from './model-utils';

const MODEL = './mobilenet_v3_large_cpu.ptl';

// 4. Variable to hold a reference to the loaded ML model
let model: any = null;

export const loadModel = async () => {
  if (model == null) {
    const filePath = await MobileModel.download(require(MODEL));
    model = await torch.jit._loadForMobile(filePath);
    console.log('LOADED');
  }
};

// Alias for torchvision transforms
const T = torchvision.transforms;

// The classifyImage function that will process an image and return the top
// class label
export default async function classifyImage(image: Image) {
  try {
    // Get image width and height
    const width = image.getWidth();
    const height = image.getHeight();

    // Convert image to blob, which is a byte representation of the image
    // in the format height (H), width (W), and channels (C), or HWC for short
    const blob = media.toBlob(image);

    // Get a tensor from image the blob and also define in what format
    // the image blob is.
    let tensor = torch.fromBlob(blob, [height, width, 3]);

    // Rearrange the tensor shape to be [CHW]
    tensor = tensor.permute([2, 0, 1]);

    // Divide the tensor values by 255 to get values between [0, 1]
    tensor = tensor.div(255);

    // Crop the image in the center to be a squared image
    const centerCrop = T.centerCrop(Math.min(width, height));
    tensor = centerCrop(tensor);

    // Resize the image tensor to model size
    const resize = T.resize(224);
    tensor = resize(tensor);

    // Normalize the tensor image with mean and standard deviation
    const normalize = T.normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]);
    tensor = normalize(tensor);

    // Unsqueeze adds 1 leading dimension to the tensor
    tensor = tensor.unsqueeze(0);
    if (model == null) {
      console.log('here');
      const filePath = await MobileModel.download(require(MODEL));
      model = await torch.jit._loadForMobile(filePath, 'cpu');
    }

    const output = await model.forward(tensor);

    // 7. Get the index of the value with the highest probability
    const maxIdx = output.argmax().item();

    // 8. Resolve the most likely class label and return it
    const classLabel = FloresEfficientNetV2Classes[maxIdx];

    return mapClassToLabel[classLabel];
  } catch (err) {
    console.error(err);
  }
}
