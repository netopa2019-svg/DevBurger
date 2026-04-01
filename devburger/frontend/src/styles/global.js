import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg:        #0d0d1a;
    --surface:   #1a1a2e;
    --surface2:  #16213e;
    --border:    #2a2a4a;
    --primary:   #e63946;
    --primary2:  #ff6b6b;
    --accent:    #ffd60a;
    --text:      #f0f0f0;
    --text2:     #aaaacc;
    --text3:     #666688;
    --success:   #06d6a0;
    --warning:   #ffd60a;
    --radius:    12px;
    --shadow:    0 8px 32px rgba(0,0,0,0.4);
  }

  body {
    font-family: 'Poppins', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; font-family: 'Poppins', sans-serif; }
  input, textarea, select { font-family: 'Poppins', sans-serif; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--primary); }
`
