import { Image, ImageKitProvider } from '@imagekit/next';

export default function Page() {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/clyde">
      <Image
        src="/default-image.jpg?updatedAt=1747073130713"
        width={500}
        height={500}
        alt="Picture of the authors"
      />
    </ImageKitProvider>
  )
}