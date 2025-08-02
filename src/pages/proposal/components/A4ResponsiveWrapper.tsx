// A4ResponsiveWrapper.tsx
import { Box, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export const A4ResponsiveWrapper = ({
  children,
  isDownload,
}: {
  children: React.ReactNode;
  isDownload: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const A4_WIDTH_PX = 794; // 210mm = ~794px at 96dpi
      const newScale = containerWidth / A4_WIDTH_PX;
      setScale(newScale > 1 ? 1 : newScale);
    };

    updateScale();

    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <Box
      ref={containerRef}
      w="100%"
      display="flex"
      justifyContent="center"
      overflowX="auto"
    >
      <VStack
        transform={isDownload ? undefined : `scale(${scale})`}
        transformOrigin="top center"
        className="print-area"
        spacing={0}
        gap={isDownload ? 0 : 6}
      >
        {children}
      </VStack>
    </Box>
  );
};
