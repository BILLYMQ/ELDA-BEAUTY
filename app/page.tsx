"use client";

import { useMemo } from "react";
import { useProducts, useHomeContent } from "@/lib/hooks";
import Hero from "@/components/home/Hero";
import PopularProducts from "@/components/home/PopularProducts";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CtaSection from "@/components/home/CtaSection";

export default function HomePage() {
  const { products } = useProducts();
  const { homeContent } = useHomeContent();

  const popularProducts = useMemo(() => {
    const available = products.filter((p) => p.available);
    if (homeContent.featuredProductIds.length > 0) {
      const featured = products.filter((p) =>
        homeContent.featuredProductIds.includes(p.id)
      );
      if (featured.length > 0) return featured.slice(0, 8);
    }
    return available.slice(0, 8);
  }, [products, homeContent.featuredProductIds]);

  return (
    <>
      <Hero content={homeContent} />
      <PopularProducts products={popularProducts} />
      <WhyChooseUs items={homeContent.whyChooseUs} />
      <Testimonials items={homeContent.testimonials} />
      <CtaSection content={homeContent} />
    </>
  );
}
