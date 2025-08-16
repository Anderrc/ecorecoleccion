"use client";
import React from "react";
import RegistroUsuarioForm from "@/components/forms/RegistroUsuarioForm";

const RegistroPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-eco-auth py-8 px-4">
      <div className="w-full max-w-lg">
        <RegistroUsuarioForm />
      </div>
    </div>
  );
};

export default RegistroPage;
