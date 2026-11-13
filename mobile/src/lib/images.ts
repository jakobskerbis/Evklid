// Fotografija naloge: kamera ali galerija, pomanjšana na 1600 px in stisnjena v JPEG (manj podatkov,
// strežnik sprejme do 5 MB). Slika med zasloni potuje prek pending (ne kot parameter poti).
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export type Photo = { uri: string; media_type: "image/jpeg"; data: string };

export async function preparePhoto(uri: string, width?: number): Promise<Photo> {
  const ctx = ImageManipulator.manipulate(uri);
  if (!width || width > 1600) ctx.resize({ width: 1600 });
  const img = await (await ctx.renderAsync()).saveAsync({ compress: 0.7, format: SaveFormat.JPEG, base64: true });
  return { uri: img.uri, media_type: "image/jpeg", data: img.base64 || "" };
}

// Vrne null, če uporabnik prekliče ali ne dovoli dostopa.
export async function pickPhoto(source: "camera" | "library"): Promise<Photo | null> {
  // Galerija: sistemski izbirnik (iOS PHPicker, Android Photo Picker) ne potrebuje dovoljenja za vse fotografije.
  if (source === "camera" && !(await ImagePicker.requestCameraPermissionsAsync()).granted) return null;
  const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 1, allowsEditing: true };
  const res = source === "camera" ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
  const a = res.canceled ? null : res.assets[0];
  return a ? preparePhoto(a.uri, a.width) : null;
}

let pending: Photo | null = null;
export const setPendingPhoto = (p: Photo | null) => void (pending = p);
export const takePendingPhoto = () => {
  const p = pending;
  pending = null;
  return p;
};
