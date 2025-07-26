import { EyeIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const SignUpPage = (): JSX.Element => {
  // Form field data
  const formFields = [
    { id: "email", label: "Email", type: "email", hasEyeIcon: false },
    { id: "password", label: "Password", type: "password", hasEyeIcon: true },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      hasEyeIcon: true,
    },
  ];

  return (
    <div
      className="bg-[#23040408] flex flex-row justify-center w-full min-h-screen"
      data-model-id="2105:35"
    >
      <div className="bg-[#23040408] w-full max-w-[1440px] py-[226px]">
        <Card className="relative w-[1038px] h-[910px] mx-auto bg-[#ffffff45] rounded-[41px] border-[5px] border-solid border-[#fef8f8]">
          <CardContent className="p-0">
            {/* Logo and Brand */}
            <div className="absolute w-[307px] h-[316px] top-[22px] left-[381px] flex flex-col items-center">
              <img
                className="w-[195px] h-[211px]"
                alt="Glow Look Logo"
                src="https://c.animaapp.com/gEgbJwMS/img/group-1@2x.png"
              />

              <div className="mt-[-14px] font-['Outfit',Helvetica] text-[64px] tracking-[0] leading-[normal]">
                <span className="text-[#92278f]">Glow</span>
                <span className="text-black">&nbsp;</span>
                <span className="font-extrabold text-[#92278f]">Look</span>
              </div>

              <div className="font-['Outfit',Helvetica] font-normal text-black text-[40px] tracking-[0] leading-[normal] mt-[5px]">
                Beauty Salon
              </div>
            </div>

            {/* Form Fields */}
            <div className="absolute top-[353px] left-[210px] flex flex-col gap-[30px] w-[672px]">
              {formFields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative h-[95px] bg-white rounded-[40px] flex items-center"
                >
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.label}
                    className="h-full border-none shadow-none text-4xl font-['Outfit',Helvetica] text-[#b8b7b7] pl-12 pr-16 py-8 placeholder:text-[#b8b7b7]"
                  />
                  {field.hasEyeIcon && (
                    <EyeIcon
                      className="absolute w-[37px] h-[37px] right-[43px] text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}

              {/* Sign Up Button */}
              <Button className="h-[95px] mt-[25px] bg-[url(https://c.animaapp.com/gEgbJwMS/img/rectangle-5.png)] bg-[100%_100%] rounded-[40px] font-['Outfit',Helvetica] font-extrabold text-white text-[40px]">
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
