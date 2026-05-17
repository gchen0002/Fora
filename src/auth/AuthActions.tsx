import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeaderAuthActions() {
  return (
    <>
      <Show when="signed-out">
        <div className="hidden items-center gap-3 lg:flex">
          <SignInButton mode="modal">
            <Button variant="secondary" className="h-12 px-6">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="h-12 px-7">Build my stack</Button>
          </SignUpButton>
        </div>
      </Show>
      <Show when="signed-in">
        <div className="hidden items-center gap-3 lg:flex">
          <Button className="h-12 px-7">Open my stack</Button>
          <UserButton />
        </div>
      </Show>
    </>
  );
}

export function MobileAuthActions() {
  return (
    <>
      <Show when="signed-out">
        <div className="flex items-center gap-3 lg:hidden">
          <SignInButton mode="modal">
            <Button variant="secondary" size="sm">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm">
              Join
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </SignUpButton>
        </div>
      </Show>
      <Show when="signed-in">
        <div className="flex items-center gap-3 lg:hidden">
          <UserButton />
        </div>
      </Show>
    </>
  );
}

export function HeroAuthActions() {
  return (
    <>
      <Show when="signed-out">
        <SignUpButton mode="modal">
          <Button size="lg" className="w-full sm:w-auto">
            Build my stack
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Button size="lg" className="w-full sm:w-auto">
          Open my stack
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </Show>
    </>
  );
}
