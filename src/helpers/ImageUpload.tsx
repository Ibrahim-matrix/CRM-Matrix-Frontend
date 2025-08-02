import { useState } from "react";
import { Input, Image, Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { CLOUDINARY_CLOUD_NAME } from "../config/RequestMethod";

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [image, setImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "health_fit"); // Replace with your actual upload preset name

      try {
        setUploading(true);
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, // Replace with your Cloudinary details
          {
            method: "POST",
            body: data,
          }
        );

        const result = await response.json();

        if (result.secure_url) {
          onImageUpload(result.secure_url);
          setImage(result.secure_url);
        } else {
          console.error("Image upload failed");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Box>
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      {uploading && (
        <Flex mt={2} align="center" gap={2}>
          <Spinner size="sm" />
          <Text fontSize="sm">% uploading...</Text>
        </Flex>
      )}
      {image && (
        <Box>
          <Image src={image} alt="Uploaded" width={"150px"} />
          <Text fontSize="sm" color="green.500">
            Uploaded successfully!
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
