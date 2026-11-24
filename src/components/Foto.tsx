import { Image, type ImageProps } from 'expo-image';

type Props = Omit<ImageProps, 'source'> & {
  uri: string;
};

export default function Foto({
  uri,
  cachePolicy,
  transition = 0,
  allowDownscaling = true,
  recyclingKey,
  contentFit = 'cover',
  priority = 'high',
  ...rest
}: Props) {
  const esRemota = /^https?:\/\//i.test(uri);

  return (
    <Image
      source={{ uri }}
      recyclingKey={recyclingKey ?? uri}
      cachePolicy={cachePolicy ?? (esRemota ? 'disk' : 'memory')}
      transition={transition}
      allowDownscaling={allowDownscaling}
      contentFit={contentFit}
      priority={priority}
      {...rest}
    />
  );
}
