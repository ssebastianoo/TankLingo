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
            navigator.serviceWorker.register("/service-worker.js");
        }
    });

    function checkClick(e) {
        if (e.target.dataset.name === correctTank.name) {
            e.target.style.backgroundColor = "green";
            points++;
        } else {
            e.target.style.backgroundColor = "red";
            points--;
        }
        setTimeout(() => {
            e.target.style.backgroundColor = "";
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
        <div class="container">
            <div class="top">
                <p class="points">
                    {points}
                    {points === 1 ? "point" : "points"}
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
                            on:click|preventDefault={checkClick}
                            on:keypress
                        >
                            <p>{tank.name}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</main>

<style lang="scss">
    main {
        height: 100vh;
    }

    header {
        color: white;
        display: flex;
        align-items: center;
        padding: 20px;
    }

    .container {
        min-height: calc(100vh - 79px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    h1,
    h2,
    p {
        margin: 0;
    }

    .points {
        text-align: right;
        padding: 0 20px;
        color: white;
        font-size: 20px;
    }

    .pic {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .guess {
        margin-top: 20px;
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

                p {
                    max-width: 300px;
                    text-align: center;
                    pointer-events: none;
                }
            }
        }
    }
</style>
