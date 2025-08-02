import { Box, Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import bgImage from "../../../icons/logo.jpg";

const A4_HEIGHT = 1122;

export const HtmlPaginated = ({
  html,
  isDownload,
}: {
  html: string;
  isDownload: boolean;
}) => {
  const fullRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    if (!fullRef.current) return;

    const contentDiv = fullRef.current;
    const children = Array.from(contentDiv.children);
    const tempPages: HTMLElement[][] = [];

    let currentPage: HTMLElement[] = [];
    let currentHeight = 0;

    children.forEach((child) => {
      const el = child as HTMLElement;
      const elHeight = el.offsetHeight;

      if (currentHeight + elHeight > A4_HEIGHT - 96) {
        // Push current page
        tempPages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }

      currentPage.push(el);
      currentHeight += elHeight;
    });

    if (currentPage.length > 0) tempPages.push(currentPage);

    // Convert each page to HTML string
    const resultPages = tempPages.map((els) =>
      els.map((el) => el.outerHTML).join("")
    );

    setPages(resultPages);
  }, [html]);

  return (
    <>
      {/* Invisible full render for measuring */}
      <Box
        ref={fullRef}
        className="page-container"
        style={{ visibility: "hidden", position: "absolute", zIndex: -1 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Paginated visible pages */}
      <Box>
        {pages.map((page, i) => (
          <Box
            key={i}
            position="relative"
            w="794px"
            h="1122px"
            bg="white"
            boxShadow="lg"
            mb={isDownload ? 0 : 6}
            px={10}
            py={24}
            className="page"
            overflow="hidden"
          >
            {/* Faint background image */}
            <Image
              src={bgImage}
              alt="Background Logo"
              position="absolute"
              top={40}
              left={0}
              w="100%"
              h="fit-content"
              objectFit="contain" // or "cover"
              opacity={0.1}
              zIndex={0}
            />

            {/* Page content on top */}
            <Box
              position="relative"
              zIndex={1}
              dangerouslySetInnerHTML={{ __html: page }}
            />
          </Box>
        ))}
      </Box>
    </>
  );
};

export default HtmlPaginated;
