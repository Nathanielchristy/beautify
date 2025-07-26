import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

export const SignInPage = (): JSX.Element => {
  const loginData = {
    logo: "https://c.animaapp.com/8vK5r0uv/img/group-1@2x.png",
    salonImage: "https://c.animaapp.com/8vK5r0uv/img/rectangle-8.png",
    googleIcon: "https://c.animaapp.com/8vK5r0uv/img/google-1@2x.png",
    eyeIcon: "https://c.animaapp.com/8vK5r0uv/img/mask-group@2x.png",
  };

  return (
    <main className="bg-[#f9f6f6] w-full min-h-screen flex items-center justify-center p-4">
      {/* Container: Side-by-side on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl h-[90vh] bg-white rounded-[30px] overflow-hidden shadow-lg">
        {/* Left: Salon image (hidden on mobile) */}
        <div className="hidden lg:block lg:w-2/5 h-full">
          <img
            src={loginData.salonImage}
            alt="Beauty salon interior"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Login form */}
        <div className="w-full lg:w-3/5 h-full flex items-center justify-center p-6 bg-[#fde5f3] border-l-[5px] border-[#dd0e7f]">
          <Card className="w-full max-w-md bg-transparent shadow-none p-0">
            <CardContent className="p-0">
              {/* Logo + Title */}
              <div className="flex flex-col items-center mb-6">
                <img
                  className="w-24 h-auto"
                  alt="Glow Look logo"
                  src={loginData.logo}
                />
                <h1 className="text-3xl font-['Outfit'] tracking-tight leading-normal mt-3 text-center">
                  <span className="text-[#92278f]">Glow</span>
                  <span className="text-black">&nbsp;</span>
                  <span className="font-extrabold text-[#92278f]">Look</span>
                </h1>
                <h2 className="text-xl font-['Outfit'] text-black tracking-tight leading-normal text-center">
                  Beauty Salon
                </h2>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <Input
                  className="w-full h-12 bg-white rounded-full px-5 text-base font-['Outfit']"
                  placeholder="Email"
                />
              </div>

              {/* Password Input + Eye Icon */}
              <div className="mb-4 relative">
                <Input
                  type="password"
                  className="w-full h-12 bg-white rounded-full px-5 text-base font-['Outfit']"
                  placeholder="Password"
                />
                <img
                  className="absolute w-5 h-5 top-1/2 -translate-y-1/2 right-5 cursor-pointer"
                  alt="Show password"
                  src={loginData.eyeIcon}
                />
              </div>

              {/* Forget Password */}
              <div className="text-right mb-4">
                <a
                  href="#"
                  className="text-xs font-['Outfit'] text-black hover:underline"
                >
                  Forget Password?
                </a>
              </div>

              {/* Login Button */}
              <Button className="w-full h-12 bg-[url(https://c.animaapp.com/8vK5r0uv/img/rectangle-5.png)] bg-cover bg-no-repeat rounded-full flex items-center justify-center mb-4">
                <span className="font-['Outfit'] font-extrabold text-white text-lg">
                  Log In
                </span>
              </Button>

              {/* OR separator */}
              <div className="flex items-center justify-center mb-4">
                <Separator className="w-1/4 h-px" />
                <span className="mx-3 text-xs font-['Outfit'] text-black">OR</span>
                <Separator className="w-1/4 h-px" />
              </div>

              {/* Google Login */}
              <Button
                variant="outline"
                className="w-full h-12 bg-white rounded-full flex items-center justify-center mb-4"
              >
                <img
                  className="w-4 h-4 mr-2"
                  alt="Google"
                  src={loginData.googleIcon}
                />
                <span className="text-xs font-['Outfit'] text-black">
                  Login With Google
                </span>
              </Button>

              {/* Sign up link */}
              <div className="text-center">
                <span className="text-xs font-['Outfit']">
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="font-bold text-[#e70c84] hover:underline"
                  >
                    Sign up
                  </a>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
