import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

export const SignInPage = (): JSX.Element => {
  // Data for the login form
  const loginData = {
    logo: "https://c.animaapp.com/8vK5r0uv/img/group-1@2x.png",
    salonImage: "https://c.animaapp.com/8vK5r0uv/img/rectangle-8.png",
    googleIcon: "https://c.animaapp.com/8vK5r0uv/img/google-1@2x.png",
    eyeIcon: "https://c.animaapp.com/8vK5r0uv/img/mask-group@2x.png",
  };

  return (
    <main
      className="bg-[#f9f6f6] flex flex-row justify-center w-full"
      data-model-id="2108:2"
    >
      <div className="bg-[#f9f6f6] w-full h-screen flex items-center justify-center">
        {/* Left side salon image */}
        <div className="w-1/2 h-full hidden lg:block">
          <img
            className="w-full h-full object-cover"
            alt="Beauty salon interior"
            src={loginData.salonImage}
          />
        </div>

        {/* Right side login card */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
          <Card className="w-full max-w-lg h-auto bg-[#fde5f3] rounded-[41px] border-[5px] border-solid border-[#dd0e7f] p-8">
            <CardContent className="p-0">
              {/* Logo and branding section */}
              <div className="flex flex-col items-center mb-8">
                <img
                  className="w-32 h-auto"
                  alt="Glow Look logo"
                  src={loginData.logo}
                />

                <h1 className="font-['Outfit',Helvetica] font-normal text-4xl tracking-tight leading-normal mt-4">
                  <span className="text-[#92278f]">Glow</span>
                  <span className="text-black">&nbsp;</span>
                  <span className="font-extrabold text-[#92278f]">Look</span>
                </h1>

                <h2 className="font-['Outfit',Helvetica] font-normal text-black text-2xl tracking-tight leading-normal">
                  Beauty Salon
                </h2>
              </div>

              {/* Email input field */}
              <div className="mb-6">
                <Input
                  className="w-full h-14 bg-white rounded-full px-6 text-lg font-['Outfit',Helvetica]"
                  placeholder="Email"
                />
              </div>

              {/* Password input field with eye icon */}
              <div className="mb-6 relative">
                <Input
                  type="password"
                  className="w-full h-14 bg-white rounded-full px-6 text-lg font-['Outfit',Helvetica]"
                  placeholder="Password"
                />
                <img
                  className="absolute w-6 h-6 top-1/2 -translate-y-1/2 right-6 cursor-pointer"
                  alt="Show password"
                  src={loginData.eyeIcon}
                />
              </div>

              {/* Forget password link */}
              <div className="text-right mb-6">
                <a href="#" className="font-['Outfit',Helvetica] font-normal text-black text-sm tracking-tight leading-normal cursor-pointer">
                  Forget Password ?
                </a>
              </div>

              {/* Login button */}
              <Button className="w-full h-14 bg-[url(https://c.animaapp.com/8vK5r0uv/img/rectangle-5.png)] bg-cover bg-no-repeat rounded-full flex items-center justify-center mb-6">
                <span className="font-['Outfit',Helvetica] font-extrabold text-white text-xl tracking-tight leading-normal">
                  Log In
                </span>
              </Button>

              {/* OR divider */}
              <div className="flex items-center justify-center mb-6">
                <Separator className="w-1/4 h-px" />
                <span className="mx-4 font-['Outfit',Helvetica] font-normal text-black text-sm">
                  OR
                </span>
                <Separator className="w-1/4 h-px" />
              </div>

              {/* Google login button */}
              <Button
                variant="outline"
                className="w-full h-14 bg-white rounded-full flex items-center justify-center mb-6"
              >
                <img
                  className="w-5 h-5 mr-2"
                  alt="Google"
                  src={loginData.googleIcon}
                />
                <span className="font-['Outfit',Helvetica] font-normal text-black text-sm">
                  Login With Google
                </span>
              </Button>

              {/* Sign up link */}
              <div className="text-center">
                <span className="font-['Outfit',Helvetica] font-normal text-sm tracking-tight leading-normal">
                  <span className="text-black">Don&apos;t have an account? </span>
                  <a href="#" className="font-bold text-[#e70c84] cursor-pointer">
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
