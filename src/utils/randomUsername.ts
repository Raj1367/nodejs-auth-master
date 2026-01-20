export function generateUsername() {
      const adjectives = [
        "cool",
        "fast",
        "silent",
        "crazy",
        "smart",
        "dark",
        "brave",
        "fierce",
        "swift",
        "bold",
        "epic",
        "mighty",
        "clever",
        "shadow",
        "rapid",
        "neon",
      ];

      const nouns = [
        "tiger",
        "coder",
        "hawk",
        "wolf",
        "ninja",
        "dev",
        "lion",
        "phoenix",
        "dragon",
        "knight",
        "ghost",
        "rider",
        "hunter",
        "samurai",
        "falcon",
        "hacker",
      ];

      const randomAdj =
        adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNumber = Math.floor(Math.random() * 1000);

      return `${randomAdj}_${randomNoun}${randomNumber}`;
    }
