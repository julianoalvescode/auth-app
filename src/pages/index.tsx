import {
  FormControl,
  FormLabel,
  Input,
  Flex,
  Stack,
  Button,
  Heading,
} from "@chakra-ui/react";
import { withSSRGuest } from "helpers";

import { useAuth } from "hooks";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";

export default function Home() {
  const { signIn } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
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
          <Heading textAlign="center">Facebook</Heading>

          <FormControl id="email">
            <FormLabel>E-mail</FormLabel>
            <Input
              isInvalid={errors?.email?.message}
              {...register("email", { required: true })}
              type="email"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Senha</FormLabel>
            <Input
              isInvalid={errors?.email?.password}
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

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
