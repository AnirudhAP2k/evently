import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="h-screen items-center flex justify-center">
      <LoginButton>
        <Button variant="default" className="size-fit px-4 py-2">
          SignIn
        </Button>
      </LoginButton>
    </section>
  );
}
