import React, { useState } from 'react';
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
import { render } from '@testing-library/react';



export default function App() {
  const [showScreen, setshowScreen] = useState(1);
  const [sha256result, setsha256result] = useState(null)
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: true,
    limitFilesConfig: { max: 1 },
    // minFileSize: 0.1, // in megabytes
    maxFileSize: 50

  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors.length) {
    return <div>Error...</div>;
  }

  const backHome = () => {
    setshowScreen(1)
    filesContent.length = 0
    setsha256result(null)


  }

  const addHash = () => {
    fetch("http://localhost:4000/DBhash/"+ sha256result, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
          }).then(res => {
            console.log("Request to Hash added", res.body);
            return res.text();

            
          })
          setshowScreen(4)
        }


  

  const handleFiles = (file) => {
    console.log(file);
    // files will be an array of files, even if only one file is selected  
      // start a new instance of FileReader
      const reader = new FileReader();
  
      // provide an onload callback for this instance of FileReader
      // this is called once reader.readAsArrayBuffer() is done
      reader.onload = () => {
        const fileResult = reader.result;
        
        crypto.subtle.digest('SHA-256', fileResult).then((hash) => {
          let correctHash = (hex(hash));
          setsha256result(correctHash) ;

          // this should contain your sha-256 hash value
          console.log(sha256result);
          fetch("http://localhost:4000/DBhash/"+ correctHash, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}, 
          }).then(res => {
            console.log("Request complete! response:", res.body);
            return res.text();
            
            
          }).then(body => {if(body == "true") {setshowScreen(3)} else if(body == "false") {setshowScreen(2)}});
          console.log(showScreen)
        });
      };


  

      // calling reader.readAsArrayBuffer and providing a file should trigger the callback above 
      // as soon as readAsArrayBuffer is complete
      reader.readAsArrayBuffer(file);
    
  }
    
  
  // this function was taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Example
  function hex(buffer) {
    var hexCodes = [];
    var view = new DataView(buffer);
    for (var i = 0; i < view.byteLength; i += 4) {
      // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
      var value = view.getUint32(i)
      // toString(16) will give the hex representation of the number without padding
      var stringValue = value.toString(16)
      // We use concatenation and slice for padding
      var padding = '00000000'
      var paddedValue = (padding + stringValue).slice(-padding.length)
      hexCodes.push(paddedValue);
    }
  
    // Join all the hex strings into one
    return hexCodes.join("");
  }
//This website has been created to identify and store data regarding files which may be deemed as illicit and/or have an interest into commiting or facilitating crime. 
// This will be done using file signatures, which will be compiled against a database 

if (showScreen == 1){
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
               <Button disabled={filesContent.length === 0} onClick={() => fetch(filesContent[0].content).then(res => res.blob()).then(blob => { handleFiles(blob) })}>Hash 256 </Button>
            </Text>
            <Link
              color="teal.500"
              href="https://blog.cryptographyengineering.com/2018/04/07/hash-based-signatures-an-illustrated-primer/"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about this project!
            </Link>
          </VStack>
        </Grid>
      </Box>
      
    </ChakraProvider>
  );
} else if (showScreen == 2){
  return (
    <ChakraProvider theme={theme}>
      <Button onClick={() => backHome()}>Home </Button>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Text>
          The image is clean!
            </Text>
            <Text>
          If you disagree! Add the image to the repository! <Button onClick={() => addHash()}> Add Image </Button>
            </Text>
            
        </Grid>
      </Box>
      
    </ChakraProvider>
  );
  } else if (showScreen == 3){
    return (
      <ChakraProvider theme={theme}>
        <Button onClick={() => backHome()}>Home </Button>
        <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <Text>
            This image is not clean and contains illicit materials!
              </Text>
          </Grid>
        </Box>
        
      </ChakraProvider>
    );
  } else if (showScreen == 4){
    return (
      <ChakraProvider theme={theme}>
        <Button onClick={() => backHome()}>Home </Button>
        <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <Text>
            The image is now stored in the repository!
              </Text>
          </Grid>
        </Box>
        
      </ChakraProvider>
    );
  }
} 

