import React, { useState } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from "react-router-dom";

const Signup = () => {
    const history = useHistory()
    const toast = useToast()
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [password, setPassword] = useState('');
    const [pic, setPic] = useState('');
    const [loading, setLoading] = useState('');

    const handleClick = () => {
        setShow(!show);
    };

    const handleClick2 = () => {
        setShow2(!show2);
    };

    //uploading images on cloudinary
    const postDetails = (pics) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "talkwave");
            data.append("cloud_name", "do4qfhmgi");
            fetch("https://api.cloudinary.com/v1_1/do4qfhmgi/image/upload", {
                method: 'post',
                body: data
            }).then((res) => res.json())
                .then(data => {
                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };

    const submitHandler = async (asd) => {
        setLoading(true);

        //check all fields are filled or not
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(true);
            return;

        }

        if (password !== confirmpassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },

            }
            const { data } = await axios.post(
                "/api/user", { name, email, password, pic },
                config
            );
            toast({
                title: "Registration is successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);

            history.push("/chats")

        } catch (error) {

        }

    }
    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? "text" : "password"}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show2 ? "text" : "password"}
                        placeholder="Confirm your password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick2}>
                            {show2 ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>




            <FormControl id="pic">
                <FormLabel>Upload your pic</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}

                />

            </FormControl>

            <Button
                colorScheme='blue'
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}> Sign Up</Button>


        </VStack>
    );
};

export default Signup;
