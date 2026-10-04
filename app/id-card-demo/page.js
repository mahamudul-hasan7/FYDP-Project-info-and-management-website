'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Sparkles, UserPlus, Eye, ShieldCheck, Check, Layers, Sliders } from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import UiuIdCard from '../../components/UiuIdCard';

export default function IdCardDemoPage() {
  const [showLanyard, setShowLanyard] = useState(true);
  const [showHolder, setShowHolder] = useState(true);
  const [selectedMemberIdx, setSelectedMemberIdx] = useState(0);

  // Test Member 6 + Real Members for testing
  const demoMembers = [
    {
      name: 'Test Member 06',
      id: '0112339999',
      dob: '15-Jan-2004',
      nationality: 'Bangladeshi',
      program: 'BSCSE',
      validity: '2023-2027',
      bloodGroup: 'B+',
      shortRole: 'QA & Research Test Lead',
      role: 'QA & Research Test Lead',
      signature: 'TestMember',
      image: '/members/md-mahamudul-hasan.jpg',
      email: 'testmember2339999@bscse.uiu.ac.bd',
      phone: '+880 1700-000000',
      tag: 'Member 06 (Demo Test)'
    },
    {
      name: 'Md Mahamudul Hasan',
      id: '0112330182',
      dob: '09-Aug-2004',
      nationality: 'Bangladeshi',
      program: 'BSCSE',
      validity: '2023-2027',
      bloodGroup: 'O+',
      shortRole: 'Technical Lead',
      role: 'Technical Lead / Developer',
      signature: 'Mahamudul',
      image: '/members/md-mahamudul-hasan.jpg',
      email: 'mhasan2330182@bscse.uiu.ac.bd',
      phone: '+880 1810-394869',
      tag: 'Member 01 (Lead Dev)'
    },
    {
      name: 'Md Sabbir Hossen',
      id: '0112331026',
      dob: '12-May-2003',
      nationality: 'Bangladeshi',
      program: 'BSCSE',
      validity: '2023-2027',
      bloodGroup: 'A+',
      shortRole: 'Faculty Communicator',
      role: 'Faculty Communicator',
      signature: 'Sabbir',
      image: '/members/md-sabbir-hossen.jpg',
      email: 'mhossen2331026@bscse.uiu.ac.bd',
      phone: '+880 1800-000000',
      tag: 'Member 02'
    },
    {
      name: 'Tania Islam',
      id: '0112331025',
      dob: '20-Oct-2003',
      nationality: 'Bangladeshi',
      program: 'BSCSE',
      validity: '2023-2027',
      bloodGroup: 'AB+',
      shortRole: 'Lead Researcher',
      role: 'Lead Researcher',
      signature: 'Tania',
      image: '/members/tania-islam.jpg',
      email: 'tislam2331025@bscse.uiu.ac.bd',
      phone: '+880 1700-000000',
      tag: 'Member 03'
    },
    {
      name: 'Maria Tasnim',
      id: '0112331027',
      dob: '04-Feb-2004',
      nationality: 'Bangladeshi',
      program: 'BSCSE',
      validity: '2023-2027',
      bloodGroup: 'O+',
      shortRole: 'Research Assistant',
      role: 'Research Assistant',
      signature: 'Maria',
      image: '/members/maria-tasnim.jpg',
      email: 'mtasnim2331027@bscse.uiu.ac.bd',
      phone: '+880 1900-000000',
      tag: 'Member 04'
    },
    {
      name: 'Rehnuma Khan',
      id: '0112331028',
      dob: '18-Dec-2003',
      nationality: 'Bangladeshi',
      program: 'BSCSE',
      validity: '2023-2027',
      bloodGroup: 'B+',
      shortRole: 'Presenter',
      role: 'Presenter',
      signature: 'Rehnuma',
      image: '/members/rehnuma-khan.jpg',
      email: 'rkhan2331028@bscse.uiu.ac.bd',
      phone: '+880 1600-000000',
      tag: 'Member 05'
    }
  ];

  const activeMember = demoMembers[selectedMemberIdx];

  return (
    <main className="app-shell id-demo-shell">
      {/* Top Bar */}
      <header className="topbar dev-topbar">
        <Link className="profile-back-btn dev-back-pill" href="/" aria-label="Back to Home">
          <ArrowLeft size={17} />
          <span className="back-text">Back to Home</span>
        </Link>

        <div className="dev-signature-mark">
          <ShieldCheck size={16} className="dev-sig-icon text-orange" />
          <span className="dev-sig-title">UIU Student ID Card <span className="text-orange">Simulator</span></span>
          <span className="dev-sig-badge">EXPERIMENTAL</span>
        </div>

        <div className="profile-top-actions">
          <ThemeToggle />
        </div>
      </header>

      {/* Demo Header */}
      <section className="id-demo-header-card">
        <div className="card-header-badge">
          <Sparkles size={16} className="text-orange" />
          <span className="mini-label">MEMBER 6 &amp; TEAM TEST PLAYGROUND</span>
        </div>
        <h1>UIU Student Smart ID Card Replica</h1>
        <p className="id-demo-subtext">
          Replicating the official physical United International University (UIU) Student ID Card with accurate typography, frosted acrylic holder casing, and 3D interactive flip mechanics.
        </p>

        {/* Member Switcher Tabs */}
        <div className="id-demo-member-tabs">
          {demoMembers.map((m, idx) => (
            <button
              key={idx}
              type="button"
              className={`id-member-tab-btn ${selectedMemberIdx === idx ? 'active' : ''} ${idx === 0 ? 'tab-demo-member' : ''}`}
              onClick={() => setSelectedMemberIdx(idx)}
            >
              {idx === 0 && <UserPlus size={13} className="text-orange" />}
              <span>{m.tag}</span>
            </button>
          ))}
        </div>

        {/* Casing & Lanyard Toggle Controls */}
        <div className="id-demo-toggles-row">
          <button
            type="button"
            className={`id-toggle-pill ${showLanyard ? 'active' : ''}`}
            onClick={() => setShowLanyard(!showLanyard)}
          >
            <Layers size={14} />
            <span>UIU Lanyard Strap: <strong>{showLanyard ? 'ON' : 'OFF'}</strong></span>
          </button>

          <button
            type="button"
            className={`id-toggle-pill ${showHolder ? 'active' : ''}`}
            onClick={() => setShowHolder(!showHolder)}
          >
            <Sliders size={14} />
            <span>Acrylic Holder Frame: <strong>{showHolder ? 'ON' : 'OFF'}</strong></span>
          </button>
        </div>
      </section>

      {/* Main Interactive Stage Area */}
      <section className="id-card-display-stage">
        <div className="id-stage-backdrop-glow" aria-hidden="true" />

        <div className="id-card-centerpiece">
          <UiuIdCard
            member={activeMember}
            showLanyard={showLanyard}
            showHolder={showHolder}
            allowFlip={true}
          />
        </div>
      </section>

      {/* Feature Checklist Notes */}
      <section className="id-demo-notes-card">
        <h3>Verified Physical ID Card Accuracy Checklist</h3>
        <div className="id-checklist-grid">
          <div className="id-checklist-item">
            <Check size={16} className="text-emerald-500" />
            <div>
              <strong>Exact Header Layout:</strong> UIU Orange Ribbon Emblem on left, bold STUDENT title on right.
            </div>
          </div>
          <div className="id-checklist-item">
            <Check size={16} className="text-emerald-500" />
            <div>
              <strong>Information Matrix:</strong> STUDENT NAME, DATE OF BIRTH, NATIONALITY, PROGRAM, VALIDITY.
            </div>
          </div>
          <div className="id-checklist-item">
            <Check size={16} className="text-emerald-500" />
            <div>
              <strong>Bottom UIU Solid Orange Banner:</strong> STUDENT ID on left, Blood Group on right.
            </div>
          </div>
          <div className="id-checklist-item">
            <Check size={16} className="text-emerald-500" />
            <div>
              <strong>Card Holder &amp; Lanyard:</strong> Beveled translucent frosted casing + branded UIU ribbon strap.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
