<template>
  <div class="terminal-content">
    <div class="terminal-line"><span class="prompt">~</span> cat ~/me.txt</div>
    <div class="terminal-line greeting">
      <span class="highlight">Greetings, User.</span>
    </div>
    <div class="terminal-line">
      I am a Full-stack Developer and a dedicated Linux enthusiast, operating at the intersection of robust backend systems and pixel-perfect front-end interfaces.
    </div>
    <div class="terminal-line">
      My workflow is rooted in the philosophy of the terminal: efficiency, transparency, and high control.
    </div>

    <div class="sysinfo-grid">
      <div class="sysinfo-item">
        <span class="sysinfo-label">OS</span>
        <span class="sysinfo-value">Neomancy v2.4.1</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">Kernel</span>
        <span class="sysinfo-value">6.5.0-dev-generic</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">Shell</span>
        <span class="sysinfo-value">Zsh (Oh-My-Zsh)</span>
      </div>
      <div class="sysinfo-item">
        <span class="sysinfo-label">WM</span>
        <span class="sysinfo-value">Mutter/Custom</span>
      </div>
    </div>

    <div class="terminal-line"><span class="prompt">~</span> <span class="cursor">█</span></div>

    <div class="terminal-statusbar">
      <span>zsh | utf-8 | josebatista@os-v1.0</span>
      <span>SYNC: OK | v1.0.4-STABLE</span>
    </div>
  </div>
</template>
