import React from 'react';
import MainBanner from '../components/MainBanner';
import SubBanner from '../components/SubBanner';
import ProductSection from '../components/ProductSection';
import MainInfo from '../components/MainInfo';

export default function HomePage() {
  return (
    <main className="mainpage-container">
      <MainBanner />
      <SubBanner />
      <ProductSection parentSlug="pc-gaming-streaming" />
      <ProductSection parentSlug="linh-kien-may-tinh" />
      <ProductSection parentSlug="man-hinh-may-tinh" />
      <ProductSection parentSlug="gaming-gear" />
      <MainInfo />
    </main>
  );
}