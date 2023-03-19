<script lang="ts">
    import { onMount } from "svelte";
    import tanks from "./tanks.json";

    type Tank = {
        name: string;
        file: string;
    };

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
    });

    function checkClick(e) {
        if (e.target.dataset.name === correctTank.name) {
            e.target.style.backgroundColor = "#75ff6e";
            points++;
        } else {
            e.target.style.backgroundColor = "#ff7a59";
            showCorrectOne = true;
            points--;
        }
        setTimeout(() => {
            e.target.style.backgroundColor = "";
            showCorrectOne = false;
            askTank();
        }, 1000);
    }
</script>

<main>
    <header>
        <h1>TankLingo</h1>
    </header>
    {#if !loaded}
        <p>loading...</p>
    {:else}
        <div class="parent">
            <div class="container">
                <div class="top">
                    <p class="points">
                        {points}
                        {points === 1 ? "Point" : "Points"}
                    </p>
                    <div class="pic">
                        <img src={"/tanks/" + correctTank.file} alt="Tank" />
                    </div>
                </div>
                <div class="guess">
                    <h2>What's this tank?</h2>
                    <div class="options">
                        {#each allTanks as tank}
                            <div
                                class="option"
                                data-name={tank.name}
                                style={showCorrectOne &&
                                tank.name === correctTank.name
                                    ? "background-color: #75ff6e"
                                    : ""}
                                on:click|preventDefault={checkClick}
                                on:keypress
                            >
                                <p>{tank.name}</p>
                            </div>
                        {/each}
                    </div>
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

    header {
        color: white;
        display: flex;
        align-items: center;
        padding: 20px;
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

    h1 {
        font-family: "Brixton Wood";
        font-size: 80px;
    }

    .points {
        text-align: right;
        padding: 0 20px;
        color: white;
        font-size: 20px;
    }

    .top {
        min-height: calc(40vh - 120px);
    }

    .pic {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .guess {
        min-height: calc(60vh - 120px);
        background-color: white;
        padding: 20px;
        border-top-left-radius: 40px;
        border-top-right-radius: 40px;

        h2 {
            text-align: center;
            margin: 10px 0 30px;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .option {
                background-color: rgba(0, 0, 0, 7%);
                display: flex;
                justify-content: center;
                border-radius: 50px;
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
</style>
