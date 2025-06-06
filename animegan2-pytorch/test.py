import os
import argparse

from PIL import Image
import numpy as np

import torch
from torchvision.transforms.functional import to_tensor, to_pil_image
from model import Generator

torch.backends.cudnn.enabled = False
torch.backends.cudnn.benchmark = False
torch.backends.cudnn.deterministic = True

MODELS = {
    'celeba_distill': 'celeba_distill',
    'face_paint_512_v1': 'face_paint_512_v1',
    'face_paint_512_v2': 'face_paint_512_v2',
    'paprika': 'paprika',
    'face_paint_512_v0': 'local',  # Indicamos que este es un modelo local
    'face_paint_512_v2_0': 'local'  # Nuevo modelo local
}

def load_image(image_path, x32=False):
    img = Image.open(image_path).convert("RGB")

    if x32:
        def to_32s(x):
            return 256 if x < 256 else x - x % 32
        w, h = img.size
        img = img.resize((to_32s(w), to_32s(h)))

    return img

def test(args):
    device = args.device
    
    # Cargar el modelo según el tipo
    if args.model in ['face_paint_512_v0', 'face_paint_512_v2_0']:
        net = Generator()
        net.load_state_dict(torch.load(f'./weights/{args.model}.pt', map_location="cpu"))
    else:
        net = torch.hub.load("bryandlee/animegan2-pytorch:main", "generator", pretrained=args.model)
    
    net.to(device).eval()
    print(f"model loaded: {args.model}")
    
    os.makedirs(args.output_dir, exist_ok=True)

    for image_name in sorted(os.listdir(args.input_dir)):
        if os.path.splitext(image_name)[-1].lower() not in [".jpg", ".png", ".bmp", ".tiff"]:
            continue
            
        image = load_image(os.path.join(args.input_dir, image_name), args.x32)

        with torch.no_grad():
            image = to_tensor(image).unsqueeze(0) * 2 - 1
            out = net(image.to(device), args.upsample_align).cpu()
            out = out.squeeze(0).clip(-1, 1) * 0.5 + 0.5
            out = to_pil_image(out)

        out.save(os.path.join(args.output_dir, image_name))
        print(f"image saved: {image_name}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--model',
        type=str,
        choices=list(MODELS.keys()),
        default='paprika',
        help='Modelo a utilizar para la conversión'
    )
    parser.add_argument(
        '--input_dir', 
        type=str, 
        default='./samples/inputs',
    )
    parser.add_argument(
        '--output_dir', 
        type=str, 
        default='./samples/results',
    )
    parser.add_argument(
        '--device',
        type=str,
        default='cuda:0',
    )
    parser.add_argument(
        '--upsample_align',
        type=bool,
        default=False,
        help="Align corners in decoder upsampling layers"
    )
    parser.add_argument(
        '--x32',
        action="store_true",
        help="Resize images to multiple of 32"
    )
    args = parser.parse_args()
    
    test(args)
