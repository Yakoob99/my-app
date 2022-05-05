import React from 'react';
import { useFilePicker } from 'use-file-picker'

import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Grid,
  Button,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import CryptoJS from 'crypto-js';
import ImageUploader from 'react-images-upload';



export default function True() {


  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Text>
          This website has been created to identify and store data regarding files which may be deemed as illicit and/or have an interest into commiting or facilitating crime.
            </Text>
          <VStack spacing={8}>
            <Logo h="40vmin" pointerEvents="none" />
            <Text>
              Select file to check against the repository   <Button onClick={() => openFileSelector()}>Select files </Button>
               <Button onClick={() => fetch(filesContent[0].content).then(res => res.blob()).then(blob => { handleFiles(blob) })}>Hash 256 </Button>
            </Text>
            <Link
              color="teal.500"
              href="https://chakra-ui.com"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn Chakra
            </Link>
          </VStack>
        </Grid>
      </Box>
      
    </ChakraProvider>
  );
} 

