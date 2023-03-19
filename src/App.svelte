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

        if (production) {
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker
                    .register("/service-worker.js", {
                        scope: "/",
                    })
                    .then((registration) => {
                        registration.update();
                    });
            }
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
                        <img src={"/tanks/" + correctTank.file} alt="Tank" />
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
        font-size: 80px;
        color: white;
        margin: 10px 0 20px;
        background: linear-gradient(to right, #7c6deb, #ee67a1, #ff9d39);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
    }

    .points {
        text-align: right;
        padding: 0 20px;
        color: black;
        font-size: 20px;
    }

    .top {
        min-height: calc(50vh);
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

        h2 {
            text-align: center;
            margin: 10px 0 30px;
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
            }
        }
    }

    footer {
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
</style>
