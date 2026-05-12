import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { CameraIcon, ImagePlusIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
type Props = {
  image?: string;
  name: string;
  setImage: (uri: string) => void;
};

const imgDir = FileSystem.documentDirectory + 'images/';
const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

const AvatarPickerField = ({ image, name, setImage }: Props) => {
  const selectImage = async (useLibrary: boolean) => {
    let result;
    const imagePickerOptions: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      cameraType: ImagePicker.CameraType.front,
    };
    if (useLibrary) {
      result = await ImagePicker.launchImageLibraryAsync(imagePickerOptions);
    } else {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(imagePickerOptions);
    }
    if (!result.canceled) {
      setImage?.(result.assets[0].uri);
    }
  };
  useEffect(() => {
    ensureDirExists();
  }, []);
  return (
    <View className="flex w-full items-center justify-center">
      <Avatar alt="avatar" className="size-36 shadow-md">
        {image ? (
          <AvatarImage
            source={{
              uri: image,
            }}
            cachePolicy="memory-disk"
            contentFit="cover"
            alt="avatar"
          />
        ) : (
          <AvatarFallback>
            <Text className="text-2xl text-white">
              {name ? name.substring(0, 2).toUpperCase() : 'NF'}
            </Text>
          </AvatarFallback>
        )}
      </Avatar>
      <View className="mt-2 flex-row items-center gap-6 rounded-lg  px-6 py-3 ">
        <Pressable onPress={() => selectImage(true)}>
          <ImagePlusIcon className="size-6 text-primary" />
        </Pressable>
        <Pressable onPress={() => selectImage(false)}>
          <CameraIcon className="size-6 text-primary" />
        </Pressable>
      </View>
      <Text className="text-muted-foreground text-center">
        *Chọn ảnh đại diện từ thư viện hoặc chụp ảnh mới
      </Text>
    </View>
  );
};

export default AvatarPickerField;
