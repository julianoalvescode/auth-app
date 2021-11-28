import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Stack,
  Button,
} from "@chakra-ui/react";

import { useAuth } from "hooks";
import { useForm } from "react-hook-form";

export default function Home() {
  const { signIn } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm();

  return (
    <>
      <Flex
        w="100vw"
        h="100vh"
        align="center"
        justify="center"
        direction="column"
        flex="1"
      >
        <Stack
          width={["280px", "300px"]}
          as="form"
          onSubmit={handleSubmit(signIn)}
          spacing="8"
        >
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input {...register("email", { required: true })} type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              {...register("password", { required: true })}
              type="password"
            />
          </FormControl>
          <Button isLoading={isSubmitting} type="submit" colorScheme="facebook">
            Login
          </Button>
        </Stack>
      </Flex>
    </>
  );
}
