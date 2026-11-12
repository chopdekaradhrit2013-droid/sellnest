"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SocialProofSection } from "@/components/SocialProofSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { DemoStorefront } from "@/components/DemoStorefront";
import { PricingSection } from "@/components/PricingSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { CreateStoreModal } from "@/components/CreateStoreModal";
import { LoginModal } from "@/components/LoginModal";

export default function HomePage() {
  const [createStoreModalOpen, setCreateStoreModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedHandle, setSelectedHandle] = useState("");

  const handleOpenCreateStore = (initialHandle?: string) => {
    if (initialHandle) {
      setSelectedHandle(initialHandle);
    }
    setCreateStoreModalOpen(true);
  };

  const handleScrollToDemo = () => {
    const demoEl = document.getElementById("demo-storefront");
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] selection:bg-purple-100 selection:text-purple-900">
      {/* 1. NAVIGATION BAR */}
      <Navbar
        onOpenCreateStore={handleOpenCreateStore}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <HeroSection
          onOpenCreateStore={handleOpenCreateStore}
          onScrollToDemo={handleScrollToDemo}
        />

        {/* 3. SOCIAL PROOF SECTION */}
        <SocialProofSection />

        {/* 4. FEATURES */}
        <FeaturesSection />

        {/* 5. HOW IT WORKS */}
        <HowItWorksSection onOpenCreateStore={() => handleOpenCreateStore()} />

        {/* 6. INTERACTIVE DEMO STOREFRONT (The Butter Room Bakery) */}
        <DemoStorefront />

        {/* 7. PRICING */}
        <PricingSection onOpenCreateStore={() => handleOpenCreateStore()} />

        {/* 8. FINAL CTA */}
        <FinalCTA onOpenCreateStore={handleOpenCreateStore} />
      </main>

      {/* 9. FOOTER */}
      <Footer />

      {/* INTERACTIVE MODALS */}
      <CreateStoreModal
        isOpen={createStoreModalOpen}
        onClose={() => setCreateStoreModalOpen(false)}
        initialHandle={selectedHandle}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onOpenDemo={handleScrollToDemo}
      />
    </div>
  );
}

