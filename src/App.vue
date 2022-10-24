<template>
  <div id="home">
    <header>
      <h1>
        <img src="https://www.wildcodeschool.com/assets/logo_main-e4f3f744c8e717f1b7df3858dce55a86c63d4766d5d9a7f454250145f097c2fe.png" alt="Wild Code School logo" />
        Les Argonautes
      </h1>
    </header>
    <router-view/>
    <footer>
      <p>Réalisé par Jason en Anthestérion de l'an 515 avant JC</p>
    </footer>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  color: #383838
}

#home {
  h1, h2 {
    text-align: center;
  }

  header {
    background: #f4f4f4;
    text-align: center;
    padding: 2em;
    img {
      max-width: 96px;
    }
    h1 {
      font-size: 2.5em;
    }
  }

  footer {
    background: #F76B6B;
    margin-top: 2em;
    text-align: center;
    color: #fff;
    background: #f76c6c;
    padding: 0.25em 0;
  }
}

</style>
