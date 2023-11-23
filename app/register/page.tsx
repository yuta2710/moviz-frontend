"use client";

import { RegisterForm } from "@/components/register-form.component";
import { UserRegisterRequestProps } from "@/types";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

enum GenderEnum {
  female = "female",
  male = "male",
  other = "other",
}

export default function RegisterPage() {
  return (
    // <React.Fragment>
    <RegisterForm />
    // </React.Fragment>
  )
}