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
    <main className="bg-[#f9f6f6] min-h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row items-stretch w-full max-w-6xl shadow-lg rounded-2xl overflow-hidden bg-white">
        {/* Left Image */}
        <div className="lg:w-[38%] w-full h-64 lg:h-auto hidden lg:block">
          <img
            src={loginData.salonImage}
            alt="Salon"
            className="h-full w-full object-cover rounded-l-2xl"
          />
        </div>

        {/* Right Card */}
        <div className="w-full lg:w-[62%] bg-[#fde5f3] border-4 border-[#dd0e7f] rounded-r-2xl p-8 flex items-center justify-center">
          <Card className="w-full max-w-md bg-transparent shadow-none border-none">
            <CardContent className="p-0">
              {/* Logo */}
              <div className="flex flex-col items-center mb-6">
                <img src={loginData.logo} alt="Logo" className="w-24" />
                <h1 className="text-3xl font-normal mt-3 font-['Outfit']">
                  <span className="text-[#92278f]">Glow </span>
                  <span className="font-extrabold text-[#92278f]">Look</span>
                </h1>
                <h2 className="text-xl font-normal text-black font-['Outfit']">Beauty Salon</h2>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <Input
                  className="w-full h-12 rounded-full bg-white px-5 text-base font-['Outfit']"
                  placeholder="Email"
                />
              </div>

              {/* Password Input */}
              <div className="mb-4 relative">
                <Input
                  type="password"
                  className="w-full h-12 rounded-full bg-white px-5 text-base font-['Outfit']"
                  placeholder="Password"
                />
                <img
                  src={loginData.eyeIcon}
                  alt="Toggle password"
                  className="absolute w-5 h-5 top-1/2 right-5 transform -translate-y-1/2 cursor-pointer"
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right text-xs text-black font-['Outfit'] mb-4">
                <a href="#" className="cursor-pointer">Forget Password ?</a>
              </div>

              {/* Login Button */}
              <Button className="w-full h-12 bg-[#92278f] text-white rounded-full font-extrabold text-lg font-['Outfit'] mb-4">
                Log In
              </Button>

              {/* OR */}
              <div className="flex items-center justify-center mb-4">
                <Separator className="w-1/4" />
                <span className="mx-3 text-xs text-black font-['Outfit']">OR</span>
                <Separator className="w-1/4" />
              </div>

              {/* Google Login */}
              <Button variant="outline" className="w-full h-12 rounded-full bg-white flex items-center justify-center mb-4">
                <img src={loginData.googleIcon} alt="Google" className="w-4 h-4 mr-2" />
                <span className="text-xs text-black font-['Outfit']">Login Within Google</span>
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-xs font-['Outfit']">
                <span className="text-black">Don't have an account? </span>
                <a href="#" className="text-[#e70c84] font-bold">Sign up</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
