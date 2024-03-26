import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  Input,
  Button,
  Checkbox,
} from "@instamint/ui-kit"
import { signUpSchema, SignUpTypes } from "@instamint/shared-types"
import useAppContext from "@/web/contexts/useAppContext"

const SignUpPage = () => {
  const router = useRouter()
  const [error, setError] = useState<Error | string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    services: {
      users: { signup },
    },
  } = useAppContext()

  const form = useForm<SignUpTypes>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      rgpdValidation: false,
    },
  })

  const onSubmit = useCallback(
    async (values: SignUpTypes) => {
      const [err] = await signup(values)

      if (err) {
        setError(err)

        return
      }

      setSuccess("User created successfully. You'll be redirected shortly!")

      setInterval(async () => {
        await router.push("/")
      }, 3000)
    },
    [signup, router]
  )

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-[95%] sm:w-[70%] xl:w-[40%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex items-center flex-col p-6 space-y-8 bg-white rounded-md shadow-xl"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      placeholder="Please enter your username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2  mt-2 text-xs">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage className="relative left-2 text-error-primary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      type="email"
                      placeholder="Please enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2  mt-2 text-xs">
                    Please enter a valid email address.
                  </FormDescription>
                  <FormMessage className="relative left-2 text-error-primary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      type="password"
                      placeholder="Please enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-xs">
                    Please enter a secure password.
                  </FormDescription>
                  <FormMessage className="relative left-2 text-error-primary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="relative left-1 font-bold">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="mt-2 py-2 px-4 focus-visible:outline-neutral-tertiary"
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="relative left-2 mt-2 text-xs">
                    Please confirm your password.
                  </FormDescription>
                  <FormMessage className="relative left-2 text-error-primary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rgpdValidation"
              render={({ field }) => (
                <FormItem className="w-full flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      id="terms2"
                      className="flex justify-center justify-items-center items-center border-2 border-black w-7 h-7 rounded-md"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Terms & Conditions</FormLabel>
                    <FormDescription className="relative left-1 mt-2 text-xs">
                      I agree to the terms and conditions.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button
              className="border-2 border-black px-5 py-2 w-[60%]"
              type="submit"
            >
              Submit
            </Button>
            {success ? (
              <p className="text-sm text-center text-black">{success}</p>
            ) : null}
            {error ? (
              <p className="text-md text-center text-error-primary">
                {error instanceof Error ? error.message : error}
              </p>
            ) : null}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignUpPage
