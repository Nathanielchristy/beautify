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
      <div className="bg-[#f9f6f6] w-[1920px] h-[1366px] relative">
        {/* Left side salon image */}
        <img
          className="absolute w-[744px] h-[1224px] top-[68px] left-[71px] object-cover"
          alt="Beauty salon interior"
          src={loginData.salonImage}
        />

        {/* Right side login card */}
        <div className="absolute w-[1057px] h-[1222px] top-[73px] left-[842px]">
          <Card className="relative w-[1039px] h-[1222px] bg-[#fde5f3] rounded-[41px] border-[5px] border-solid border-[#dd0e7f]">
            <CardContent className="p-0">
              {/* Logo and branding section */}
              <div className="absolute w-[307px] h-[387px] top-[134px] left-[346px]">
                <img
                  className="absolute w-[195px] h-[258px] top-0 left-[18px]"
                  alt="Glow Look logo"
                  src={loginData.logo}
                />

                <h1 className="absolute w-[307px] top-[242px] left-0 font-['Outfit',Helvetica] font-normal text-[64px] tracking-[0] leading-normal">
                  <span className="text-[#92278f]">Glow</span>
                  <span className="text-black">&nbsp;</span>
                  <span className="font-extrabold text-[#92278f]">Look</span>
                </h1>

                <h2 className="absolute w-[233px] top-[326px] left-[42px] font-['Outfit',Helvetica] font-normal text-black text-[40px] tracking-[0] leading-normal">
                  Beauty Salon
                </h2>
              </div>

              {/* Email input field */}
              <div className="absolute w-[673px] h-[116px] top-[541px] left-[175px]">
                <Input
                  className="absolute w-full h-full bg-white rounded-[40px] px-12 text-4xl font-['Outfit',Helvetica]"
                  placeholder="Email"
                />
              </div>

              {/* Password input field with eye icon */}
              <div className="absolute w-[673px] h-[116px] top-[692px] left-[175px] relative">
                <Input
                  type="password"
                  className="absolute w-full h-full bg-white rounded-[40px] px-12 text-4xl font-['Outfit',Helvetica]"
                  placeholder="Password"
                />
                <img
                  className="absolute w-[41px] h-[41px] top-[33px] right-[38px] cursor-pointer"
                  alt="Show password"
                  src={loginData.eyeIcon}
                />
              </div>

              {/* Forget password link */}
              <div className="absolute w-[197px] top-[827px] left-[650px] font-['Outfit',Helvetica] font-normal text-black text-2xl tracking-[0] leading-normal cursor-pointer">
                Forget Password ?
              </div>

              {/* Login button */}
              <Button className="absolute w-[673px] h-[116px] top-[888px] left-[175px] bg-[url(https://c.animaapp.com/8vK5r0uv/img/rectangle-5.png)] bg-[100%_100%] rounded-[40px] flex items-center justify-center">
                <span className="font-['Outfit',Helvetica] font-extrabold text-white text-[40px] tracking-[0] leading-normal">
                  Log In
                </span>
              </Button>

              {/* OR divider */}
              <div className="absolute w-full top-[1017px] flex items-center justify-center">
                <Separator className="w-[221px] h-[3px]" />
                <span className="mx-4 font-['Outfit',Helvetica] font-normal text-black text-2xl">
                  OR
                </span>
                <Separator className="w-[221px] h-[3px]" />
              </div>

              {/* Google login button */}
              <Button
                variant="outline"
                className="absolute w-[189px] h-[38px] top-[1077px] left-[417px] bg-white rounded-[40px] flex items-center justify-start px-3"
              >
                <img
                  className="w-[23px] h-[23px] mr-2"
                  alt="Google"
                  src={loginData.googleIcon}
                />
                <span className="font-['Outfit',Helvetica] font-normal text-black text-base">
                  Login Within Google
                </span>
              </Button>

              {/* Sign up link */}
              <div className="absolute w-[223px] top-[1128px] left-[400px] font-['Outfit',Helvetica] font-normal text-base tracking-[0] leading-normal">
                <span className="text-black">Don&apos;t have an account? </span>
                <span className="font-bold text-[#e70c84] cursor-pointer">
                  Sign up
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
