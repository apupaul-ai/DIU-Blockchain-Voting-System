import { useState } from "react";

const translations = {
  bn: {
    university: "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি",
    department: "ডিপার্টমেন্ট অব কম্পিউটিং অ্যান্ড ইনফরমেশন সিস্টেমস",
    navOverview: "সারসংক্ষেপ",
    navCandidates: "প্রার্থী",
    navProcess: "প্রক্রিয়া",
    badge: "ব্লকচেইন-ভিত্তিক ভোটিং সিস্টেম",
    title1: "Secure Digital Voting",
    title2: "for Academic Demonstration",
    description:
      "Ethereum, Solidity, Hardhat, React এবং MetaMask ব্যবহার করে তৈরি একটি একাডেমিক ভোটিং সিস্টেম। প্রতিটি wallet থেকে একবার ভোট দেওয়া যাবে এবং ফলাফল সরাসরি blockchain থেকে আসবে।",
    connect: "Connect Wallet",
    switchVoter: "Switch Voter",
    refresh: "Refresh Results",
    currentElection: "বর্তমান নির্বাচন",
    network: "নেটওয়ার্ক",
    policy: "ভোটিং নীতি",
    oneVote: "প্রতি ওয়ালেটে একটি ভোট",
    academicDemo: "Academic Demo",
    overview: "নির্বাচনের সারসংক্ষেপ",
    overviewText: "Blockchain থেকে প্রাপ্ত সর্বশেষ পরিসংখ্যান",
    totalCandidates: "মোট প্রার্থী",
    totalVotes: "মোট ভোট",
    walletStatus: "ওয়ালেট স্ট্যাটাস",
    walletConnected: "সংযুক্ত",
    walletReady: "ভোট দেওয়ার জন্য প্রস্তুত",
    walletVoted: "ভোট দেওয়া হয়েছে",
    walletNotConnected: "সংযুক্ত নয়",
    candidatesTitle: "প্রার্থীদের তালিকা",
    candidatesText: "আপনার পছন্দের প্রার্থী নির্বাচন করুন",
    voteFor: "Vote for",
    alreadyVoted: "Vote Submitted",
    waiting: "Processing...",
    noCandidates: "কোনো প্রার্থী পাওয়া যায়নি। Contract deployment চেক করুন।",
    workflow: "ভোটিং প্রক্রিয়া",
    step1Title: "Wallet Connect",
    step1Text: "MetaMask দিয়ে Hardhat Local network-এ সংযুক্ত করুন।",
    step2Title: "Choose Candidate",
    step2Text: "Apu অথবা Sazim-এর মধ্যে যেকোনো একজনকে নির্বাচন করুন।",
    step3Title: "Confirm Transaction",
    step3Text: "MetaMask-এ transaction confirm করুন এবং result দেখুন।",
    technical: "প্রযুক্তিগত তথ্য",
    projectFooter: "Academic Blockchain Voting Project",
    disclaimer:
      "এটি Daffodil International University-এর জন্য তৈরি একটি student academic demonstration. এটি কোনো official university voting system নয়।"
  },
  en: {
    university: "Daffodil International University",
    department: "Department of Computing and Information Systems",
    navOverview: "Overview",
    navCandidates: "Candidates",
    navProcess: "Process",
    badge: "BLOCKCHAIN-BASED VOTING SYSTEM",
    title1: "Secure Digital Voting",
    title2: "for Academic Demonstration",
    description:
      "An academic voting system built with Ethereum, Solidity, Hardhat, React, and MetaMask. Each wallet can vote once, and all results are retrieved directly from the blockchain.",
    connect: "Connect Wallet",
    switchVoter: "Switch Voter",
    refresh: "Refresh Results",
    currentElection: "Current Election",
    network: "Network",
    policy: "Voting Policy",
    oneVote: "One vote per wallet",
    academicDemo: "Academic Demo",
    overview: "Election Overview",
    overviewText: "Latest statistics retrieved from the blockchain",
    totalCandidates: "Total Candidates",
    totalVotes: "Total Votes",
    walletStatus: "Wallet Status",
    walletConnected: "Connected",
    walletReady: "Ready to vote",
    walletVoted: "Vote already recorded",
    walletNotConnected: "Not connected",
    candidatesTitle: "Candidates",
    candidatesText: "Choose your preferred candidate",
    voteFor: "Vote for",
    alreadyVoted: "Vote Submitted",
    waiting: "Processing...",
    noCandidates: "No candidates found. Please check the contract deployment.",
    workflow: "Voting Process",
    step1Title: "Connect Wallet",
    step1Text: "Connect MetaMask to the Hardhat Local network.",
    step2Title: "Choose Candidate",
    step2Text: "Select either Apu or Sazim from the candidate list.",
    step3Title: "Confirm Transaction",
    step3Text: "Confirm the transaction in MetaMask and view the result.",
    technical: "Technical Information",
    projectFooter: "Academic Blockchain Voting Project",
    disclaimer:
      "This is a student academic demonstration prepared for Daffodil International University. It is not an official university voting system."
  }
};

const bnNotices = {
  "Connect MetaMask to participate in this local election.":
    "এই local election-এ অংশ নিতে MetaMask connect করুন।",
  "Wallet connected. You can now participate in the election.":
    "Wallet connect হয়েছে। এখন আপনি ভোট দিতে পারবেন।",
  "Latest voting results loaded from the blockchain.":
    "Blockchain থেকে সর্বশেষ voting result আনা হয়েছে।",
  "Please confirm your voting transaction in MetaMask.":
    "MetaMask-এ voting transaction confirm করুন।",
  "Transaction submitted. Waiting for blockchain confirmation...":
    "Transaction submit হয়েছে। Blockchain confirmation-এর অপেক্ষায়...",
  "Vote successfully recorded on the blockchain!":
    "আপনার ভোট সফলভাবে blockchain-এ record হয়েছে!",
  "Voter wallet switched successfully!":
    "নতুন voter wallet সফলভাবে switch হয়েছে!",
  "This wallet has already cast its vote.":
    "এই wallet থেকে ইতিমধ্যে ভোট দেওয়া হয়েছে।"
};

export default function DIUView({
  account,
  candidates,
  totalVotes,
  hasVoted,
  online,
  loading,
  busy,
  notice,
  leader,
  onConnect,
  onSwitch,
  onRefresh,
  onVote,
  shortAddress,
  contractAddress
}) {
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  const formatNumber = (number) =>
    new Intl.NumberFormat(language === "bn" ? "bn-BD" : "en-US").format(number);

  const alertText =
    language === "bn" ? (bnNotices[notice?.text] || notice?.text || "") : (notice?.text || "");

  const electionTitle = candidates.length
    ? candidates.map((candidate) => candidate.name).join(" / ")
    : "Apu / Sazim";

  const walletState = !account
    ? t.walletNotConnected
    : hasVoted
    ? t.walletVoted
    : t.walletReady;

  return (
    <div className="diu-site">
      <div className="top-stripe" />

      <header className="site-header">
        <div className="container header-row">
          <div className="brand-block">
            <div className="brand-logo">DIU</div>
            <div className="brand-text">
              <h1>{t.university}</h1>
              <p>{t.department}</p>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#overview">{t.navOverview}</a>
            <a href="#candidates">{t.navCandidates}</a>
            <a href="#process">{t.navProcess}</a>
          </nav>

          <div className="header-actions">
            <div className="lang-switch">
              <button
                className={language === "bn" ? "active" : ""}
                onClick={() => setLanguage("bn")}
              >
                বাংলা
              </button>
              <button
                className={language === "en" ? "active" : ""}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
            </div>

            <button
              className="ghost-btn"
              onClick={account ? onSwitch : onConnect}
              disabled={busy}
            >
              {account ? t.switchVoter : t.connect}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-left">
              <span className="hero-badge">{t.badge}</span>
              <h2>
                {t.title1}
                <span>{t.title2}</span>
              </h2>
              <p>{t.description}</p>

              <div className="hero-buttons">
                <a href="#candidates" className="primary-btn">
                  {t.navCandidates}
                </a>
                <button
                  className="secondary-btn"
                  onClick={account ? onSwitch : onConnect}
                  disabled={busy}
                >
                  {account ? t.switchVoter : t.connect}
                </button>
              </div>

              <div className="hero-meta">
                <span className={`status-dot ${online ? "online" : "offline"}`} />
                <span>Hardhat Local</span>
                <span className="meta-divider" />
                <span>Chain ID 31337</span>
              </div>
            </div>

            <div className="hero-card">
              <small>{t.academicDemo}</small>
              <h3>{t.currentElection}</h3>
              <div className="election-name">{electionTitle}</div>

              <div className="hero-card-line">
                <span>{t.network}</span>
                <strong>Hardhat Local</strong>
              </div>
              <div className="hero-card-line">
                <span>{t.policy}</span>
                <strong>{t.oneVote}</strong>
              </div>
              <div className="hero-card-line">
                <span>{t.totalCandidates}</span>
                <strong>{loading ? "—" : formatNumber(candidates.length)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="section-block">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-label">{t.academicDemo}</span>
                <h2>{t.overview}</h2>
                <p>{t.overviewText}</p>
              </div>
              <button className="ghost-btn" onClick={onRefresh} disabled={busy}>
                {t.refresh}
              </button>
            </div>

            <div className={`notice-box ${notice?.kind || "info"}`}>
              {alertText}
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>01</span>
                <h3>{t.totalCandidates}</h3>
                <strong>{loading ? "—" : formatNumber(candidates.length)}</strong>
              </div>

              <div className="stat-card">
                <span>02</span>
                <h3>{t.totalVotes}</h3>
                <strong>{loading ? "—" : formatNumber(totalVotes)}</strong>
              </div>

              <div className="stat-card">
                <span>03</span>
                <h3>{t.walletStatus}</h3>
                <strong>{walletState}</strong>
                <small>{account ? shortAddress(account) : "MetaMask"}</small>
              </div>
            </div>
          </div>
        </section>

        <section id="candidates" className="section-block">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-label">{t.navCandidates}</span>
                <h2>{t.candidatesTitle}</h2>
                <p>{t.candidatesText}</p>
              </div>
            </div>

            <div className="candidate-grid">
              {candidates.map((candidate, index) => {
                const percentage = totalVotes ? (candidate.votes / totalVotes) * 100 : 0;

                return (
                  <div className="candidate-card" key={candidate.id}>
                    <div className="candidate-top">
                      <div className={`candidate-avatar ${index % 2 === 0 ? "green" : "blue"}`}>
                        {candidate.name.charAt(0).toUpperCase()}
                      </div>
                      {leader?.id === candidate.id && <span className="leader-pill">Leading</span>}
                    </div>

                    <h3>{candidate.name}</h3>
                    <p>Candidate #{candidate.id}</p>

                    <div className="candidate-stats">
                      <div>
                        <span>{t.totalVotes}</span>
                        <strong>{formatNumber(candidate.votes)}</strong>
                      </div>
                      <div>
                        <span>Share</span>
                        <strong>{percentage.toFixed(1)}%</strong>
                      </div>
                    </div>

                    <div className="progress-bar">
                      <div style={{ width: `${percentage}%` }} />
                    </div>

                    <button
                      className="primary-btn full-btn"
                      onClick={() => onVote(candidate.id)}
                      disabled={!online || !account || hasVoted || busy}
                    >
                      {busy
                        ? t.waiting
                        : hasVoted
                        ? t.alreadyVoted
                        : `${t.voteFor} ${candidate.name}`}
                    </button>
                  </div>
                );
              })}
            </div>

            {!loading && candidates.length === 0 && (
              <div className="empty-box">{t.noCandidates}</div>
            )}
          </div>
        </section>

        <section id="process" className="section-block">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="section-label">WORKFLOW</span>
                <h2>{t.workflow}</h2>
              </div>
            </div>

            <div className="process-grid">
              <div className="process-card">
                <span>01</span>
                <h3>{t.step1Title}</h3>
                <p>{t.step1Text}</p>
              </div>
              <div className="process-card">
                <span>02</span>
                <h3>{t.step2Title}</h3>
                <p>{t.step2Text}</p>
              </div>
              <div className="process-card">
                <span>03</span>
                <h3>{t.step3Title}</h3>
                <p>{t.step3Text}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div className="container tech-card">
            <div>
              <span className="section-label">{t.technical}</span>
              <h2>{t.projectFooter}</h2>
              <p>Solidity · Hardhat · React · ethers.js · MetaMask</p>
            </div>

            <div className="contract-box">
              <small>CONTRACT ADDRESS</small>
              <code>{contractAddress ? shortAddress(contractAddress) : "N/A"}</code>
              <span>Hardhat Local · 31337</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-wrap">
          <div>
            <h3>{t.university}</h3>
            <p>{t.department}</p>
          </div>
          <div className="footer-right">
            <p>{t.projectFooter}</p>
            <small>{t.disclaimer}</small>
          </div>
        </div>
      </footer>
    </div>
  );
}
