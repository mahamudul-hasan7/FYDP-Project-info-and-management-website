'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

export default function UiuIdCard({
  member,
  showLanyard = false,
  showHolder = false,
  allowFlip = true,
  className = ''
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  // Exact data normalization matching the real UIU Student ID Card
  const cardData = {
    name: (member?.name || 'MD MAHAMUDUL HASAN').toUpperCase(),
    studentId: member?.id || '0112330182',
    dob: member?.dob || '09-Aug-2004',
    nationality: member?.nationality || 'Bangladeshi',
    program: member?.program || 'BSCSE',
    validity: member?.validity || '2023-2027',
    bloodGroup: member?.bloodGroup || 'O+',
    signature: member?.signature || (member?.name ? member.name.split(' ')[1] || member.name.split(' ')[0] : 'Mahamudul'),
    image: member?.image || '/members/md-mahamudul-hasan.jpg',
    serialCode: member?.serialCode || '0002079423 (2201)'
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const rotateX = isHovered ? (mousePos.y - 0.5) * -6 : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * 8 : 0;

  return (
    <div className={`uiu-id-card-wrapper ${className}`}>
      {/* Top Lanyard Assembly */}
      {showLanyard && (
        <div className="uiu-lanyard-assembly">
          <div className="uiu-lanyard-ribbon">
            <span className="uiu-ribbon-text">UIU</span>
            <div className="uiu-ribbon-subtext">UNITED INTERNATIONAL UNIVERSITY</div>
          </div>
          <div className="uiu-lanyard-leather-loop">
            <span className="uiu-rivet" />
          </div>
          <div className="uiu-metal-clip-assembly">
            <div className="uiu-clip-ring" />
            <div className="uiu-clip-swivel" />
            <div className="uiu-clip-hook" />
          </div>
        </div>
      )}

      {/* 3D Perspective Card Stage */}
      <div
        className="uiu-card-3d-stage"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0.5, y: 0.5 });
        }}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s ease-out'
        }}
      >
        {/* Transparent Frosted Acrylic Card Holder */}
        <div className={`uiu-holder-casing ${showHolder ? 'holder-visible' : 'holder-naked'}`}>
          {showHolder && (
            <div className="uiu-holder-header-slot">
              <span className="uiu-slot-hole uiu-slot-left" />
              <div className="uiu-slot-center-anchor" />
              <span className="uiu-slot-hole uiu-slot-right" />
            </div>
          )}

          {/* 3D Flip Card Container */}
          <div className={`uiu-id-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
            {/* ========================================================
                FRONT SIDE (EXACT UIU STUDENT ID CARD REPLICA)
                ======================================================== */}
            <div className="uiu-card-face uiu-card-front">
              {/* Top Header Row */}
              <div className="uiu-card-header">
                <div className="uiu-brand-cluster">
                  <div className="uiu-crest-icon">
                    <Image
                      src="/uiu-logo.svg"
                      alt="United International University Logo"
                      width={40}
                      height={36}
                      priority
                      className="uiu-logo-img"
                    />
                  </div>
                  <div className="uiu-brand-names">
                    <span className="uiu-name-main">UNITED</span>
                    <span className="uiu-name-sub">INTERNATIONAL</span>
                    <span className="uiu-name-univ">UNIVERSITY</span>
                  </div>
                </div>

                <div className="uiu-student-badge">
                  <span>STUDENT</span>
                </div>
              </div>

              {/* Main Content Body */}
              <div className="uiu-card-body-grid">
                {/* Left & Center: Student Info Fields */}
                <div className="uiu-data-fields">
                  <div className="uiu-field-group uiu-name-group">
                    <span className="uiu-label">STUDENT NAME</span>
                    <strong className="uiu-val-name">{cardData.name}</strong>
                  </div>

                  <div className="uiu-fields-dual-row">
                    <div className="uiu-field-group">
                      <span className="uiu-label">DATE OF BIRTH</span>
                      <strong className="uiu-value">{cardData.dob}</strong>
                    </div>
                    <div className="uiu-field-group">
                      <span className="uiu-label">NATIONALITY</span>
                      <strong className="uiu-value">{cardData.nationality}</strong>
                    </div>
                  </div>

                  <div className="uiu-fields-dual-row">
                    <div className="uiu-field-group">
                      <span className="uiu-label">PROGRAM</span>
                      <strong className="uiu-value">{cardData.program}</strong>
                    </div>
                    <div className="uiu-field-group">
                      <span className="uiu-label">VALIDITY</span>
                      <strong className="uiu-value">{cardData.validity}</strong>
                    </div>
                  </div>
                </div>

                {/* Right: Photo & Handwritten Signature */}
                <div className="uiu-photo-signature-col">
                  <div className="uiu-photo-frame">
                    <Image
                      src={cardData.image}
                      alt={cardData.name}
                      width={92}
                      height={110}
                      priority
                      className="uiu-student-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="uiu-photo-fallback">
                      {cardData.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                  </div>

                  <div className="uiu-signature-box">
                    <span className="uiu-sig-handwriting">{cardData.signature}</span>
                    <div className="uiu-sig-underline" />
                    <span className="uiu-sig-label">Holder&apos;s Signature</span>
                  </div>
                </div>
              </div>

              {/* Bottom UIU Solid Orange Strip */}
              <div className="uiu-card-bottom-banner">
                <div className="uiu-banner-id">
                  <span className="uiu-id-label">STUDENT ID:</span>
                  <strong className="uiu-id-value">{cardData.studentId}</strong>
                </div>
                <div className="uiu-banner-blood">
                  <span>Blood Group: <strong>{cardData.bloodGroup}</strong></span>
                </div>
              </div>
            </div>

            {/* ========================================================
                BACK SIDE (EXACT UIU CARD BACK REPLICA)
                ======================================================== */}
            <div className="uiu-card-face uiu-card-back">
              {/* Top Legal Clauses */}
              <div className="uiu-back-rules">
                <p>1. Unlawful use of this card will be deemed as an offence and may result in the cancellation of this card.</p>
                <p>2. United International University reserves the right to cancel the card at any time.</p>
              </div>

              {/* Barcode & Authorized Signature Row */}
              <div className="uiu-back-barcode-row">
                <div className="uiu-barcode-box">
                  <div className="uiu-real-barcode" />
                </div>
                <div className="uiu-authorized-sig-box">
                  <div className="uiu-auth-sig-graphic" />
                  <span className="uiu-auth-sig-label">Authorized Signature</span>
                </div>
              </div>

              {/* Center University Title */}
              <div className="uiu-back-center-title">
                <strong>United International University</strong>
              </div>

              {/* Bottom Orange Address Banner */}
              <div className="uiu-back-orange-panel">
                <div className="uiu-back-panel-inner">
                  <p className="uiu-return-notice">If found, please return to the following address:</p>
                  <p className="uiu-campus-name">UIU Campus:</p>
                  <p className="uiu-campus-line">United City, Madani Avenue, Badda, Dhaka 1212, Bangladesh.</p>
                  <p className="uiu-campus-line">Phone : +8809604 UIU UIU (848 848)</p>
                  <p className="uiu-campus-line">E-mail: info@uiu.ac.bd, Web: www.uiu.ac.bd</p>

                  <div className="uiu-back-serial-stamp">
                    <span>{cardData.serialCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flip Button Control */}
      {allowFlip && (
        <div className="uiu-card-controls">
          <button
            type="button"
            className="uiu-control-btn uiu-flip-btn"
            onClick={() => setIsFlipped(!isFlipped)}
            title="Flip ID Card"
          >
            <RefreshCw size={14} className={isFlipped ? 'spin-icon' : ''} />
            <span>{isFlipped ? 'View Front Side' : 'Flip to Back Side'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
