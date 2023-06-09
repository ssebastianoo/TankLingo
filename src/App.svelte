<script lang="ts">
    import { onMount } from "svelte";
    import tanks from "./tanks.json";

    const production = import.meta.env.MODE === "production";

    $: correctTank = null;
    $: allTanks = null;
    $: points = 0;

    let loaded: boolean = false;
    let showCorrectOne: boolean = false;

    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    }

    function askTank() {
        correctTank = tanks[Math.floor(Math.random() * tanks.length)];
        let newTanks = tanks.filter((tank) => tank !== correctTank);
        allTanks = [correctTank];
        for (let i = 0; i < 3; i++) {
            const wrongTank =
                newTanks[Math.floor(Math.random() * newTanks.length)];
            allTanks.push(wrongTank);
            newTanks = newTanks.filter((tank) => tank !== wrongTank);
        }
        shuffle(allTanks);
        loaded = true;
    }

    onMount(() => {
        askTank();
        loaded = true;

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker.js", {
                    scope: "/",
                })
                .then((registration) => {
                    registration.update();
                });
        }

        if (!matchMedia("(display-mode: browser)").matches) {
            console.log("aa");
            window.moveTo(540, 46);
            window.resizeTo(500, 744);
        }
    });

    let canClick = true;

    function checkClick(e) {
        if (canClick) {
            if (e.target.dataset.name === correctTank.name) {
                e.target.style.background = "#75ff6e";
                points++;
            } else {
                e.target.style.background = "#ff7a59";
                showCorrectOne = true;
                points--;
            }
            canClick = false;
            setTimeout(() => {
                e.target.style.background = "";
                showCorrectOne = false;
                askTank();
                canClick = true;
            }, 1000);
        }
    }
</script>

<main>
    {#if !loaded}
        <p>loading...</p>
    {:else}
        <div class="parent">
            <div class="container">
                <div class="top">
                    <header>
                        <h1 class="title">TankLingo</h1>
                    </header>
                    <p class="points">
                        {points}
                        {points === 1 ? "Point" : "Points"}
                    </p>
                    <div class="pic">
                        <img
                            src={"/tanks/" + correctTank.file}
                            alt="Tank"
                            height="170px"
                        />
                    </div>
                </div>
                <div class="guess">
                    <div>
                        <h2>What's this tank?</h2>
                        <div class="options">
                            {#each allTanks as tank}
                                <div
                                    class="option"
                                    data-name={tank.name}
                                    style={showCorrectOne &&
                                    tank.name === correctTank.name
                                        ? "background:none;background-color: #75ff6e"
                                        : ""}
                                    on:click|preventDefault={checkClick}
                                    on:keypress
                                >
                                    <p>{tank.name}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <footer>
                        <a
                            href="https://github.com/ssebastianoo/TankLingo"
                            target="_blank">GitHub</a
                        >
                    </footer>
                </div>
            </div>
        </div>
    {/if}
</main>

<style lang="scss">
    @font-face {
        font-family: "Brixton Wood";
        src: url("/Brixton_Wood.otf");
    }

    main {
        height: 100vh;
    }

    .parent {
        display: flex;
        justify-content: center;
    }

    .container {
        width: 100%;
        max-width: 500px;
        min-height: calc(100vh - 120px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    h1,
    h2,
    p {
        margin: 0;
    }

    header {
        display: flex;
        justify-content: center;
    }

    .title {
        font-family: "Brixton Wood";
        font-size: 5em;
        color: white;
        margin: 20px 0 20px;
        background: linear-gradient(to right, #7c6deb, #ee67a1, #ff9d39);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }

    .points {
        text-align: right;
        padding: 0 20px;
        font-size: 1.2em;
    }

    .top {
        min-height: 50vh;
    }

    .pic {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .guess {
        min-height: calc(50vh - 40px);
        background-color: #0e0e0e;
        padding: 20px;
        border-top-left-radius: 40px;
        border-top-right-radius: 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 0.9em;

        h2 {
            font-size: 1.3rem;
            text-align: center;
            margin: 0 0 20px;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .option {
                background: linear-gradient(to right, #8933ff, #46d0ff);
                display: flex;
                justify-content: center;
                border-radius: 12px;
                padding: 10px;
                cursor: pointer;

                p {
                    max-width: 300px;
                    text-align: center;
                    pointer-events: none;
                }

                &:hover {
                    outline: 2px solid white;
                }
            }
        }
    }

    footer {
        margin-top: 20px;
        text-align: center;

        a {
            color: unset;
            text-decoration: none;
            opacity: 0.5;

            &:hover {
                opacity: 1;
                text-decoration: underline;
            }
        }
    }

    @media (max-height: 660px) {
        .pic img {
            height: 120px;
        }

        .top {
            min-height: 45vh;
        }

        .guess {
            min-height: calc(55vh - 40px);
        }

        .title {
            font-size: 4em;
        }
    }
</style>
