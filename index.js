let reset_btn = document.getElementById("reset_btn");
let start_btn = document.getElementById("start_btn");
let stop_btn = document.getElementById("stop_btn");
let bars_container = document.getElementById("bars_container");
let select_algo = document.getElementById("algo");
let speed = document.getElementById("speed"); //use slide further
let slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");

sliderValue.textContent = slider.value;
// let array_size = document.getElementById("array_size");


let isSorting = false;
let isPaused = false;
let stopSignal = false; // For reset or hard stop
let currentSortPromise = null; // For resuming





let minRange = 1;
let maxRange = slider.value;
let numOfBars = slider.value;
let heightFactor = 4;
let speedFactor = 100;

// array_size.addEventListener("change", function () {
//   numOfBars = array_size.value;
//   maxRange = array_size.value;
//   bars_container.innerHTML = "";
//   unsorted_array = createRandomArray();
//   renderBars(unsorted_array);
// });


let unsorted_array = new Array(numOfBars);

slider.addEventListener("input", function () {
    if (isSorting) return; // Prevent changing slider while sorting
    sliderValue.textContent = this.value;
    numOfBars = slider.value;
    maxRange = slider.value;
    //console.log(numOfBars);
    bars_container.innerHTML = "";
    unsorted_array = createRandomArray();
    renderBars(unsorted_array);
});

speed.addEventListener("change", (e) => {
    speedFactor = parseInt(e.target.value);
});

let algotouse = "";

select_algo.addEventListener("change", function () {
    algotouse = select_algo.value;
});

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomArray() {
    let array = new Array(numOfBars);
    for (let i = 0; i < numOfBars; i++) {
        array[i] = randomNum(minRange, maxRange);
    }

    return array;
}


document.addEventListener("DOMContentLoaded", function () {
    unsorted_array = createRandomArray();
    renderBars(unsorted_array);
});

function renderBars(array) {
    for (let i = 0; i < numOfBars; i++) {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = array[i] * heightFactor + "px";
        bars_container.appendChild(bar);
    }
}


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

//SORTNG ALGORITHMS FUNTIONS

async function selectionSort(array) {
    let bars = document.getElementsByClassName("bar");

    for (let i = 0; i < array.length; i++) {
        if (stopSignal) {
            return; // Stop sorting if reset is pressed
        }
        while (isPaused) {
            await sleep(50);
            if (stopSignal) return; // Check stopSignal even while paused
        }

        let minIndex = i;

        bars[minIndex].style.backgroundColor = "red";

        for (let j = i + 1; j < array.length; j++) {
            if (stopSignal) {
                return; // Stop sorting if reset is pressed
            }
            while (isPaused) {
                await sleep(50);
                if (stopSignal) return; // Check stopSignal even while paused
            }

            bars[j].style.backgroundColor = "orange";

            await sleep(speedFactor);

            if (array[j] < array[minIndex]) {
                if (minIndex !== i) {
                    bars[minIndex].style.backgroundColor = "aqua";
                }

                minIndex = j;
                bars[minIndex].style.backgroundColor = "red";
            } else {
                bars[j].style.backgroundColor = "aqua";
            }
        }

        if (minIndex !== i) {
            let temp = array[i];
            array[i] = array[minIndex];
            array[minIndex] = temp;

            bars[i].style.height = array[i] * heightFactor + "px";
            bars[minIndex].style.height = array[minIndex] * heightFactor + "px";

            bars[i].style.backgroundColor = "lightgreen";
            bars[minIndex].style.backgroundColor = "lightgreen";

            await sleep(speedFactor);
        }

        for (let k = 0; k < array.length; k++) {
            if (k !== i) {
                bars[k].style.backgroundColor = "aqua";
            }
        }
    }

    return array;
}


async function bubbleSort(array) {
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length; i++) {
        if (stopSignal) {
            return; // Stop sorting if reset is pressed
        }
        for (let j = 0; j < array.length - i - 1; j++) {
            if (stopSignal) {
                return; // Stop sorting if reset is pressed
            }
            while (isPaused) {
                await sleep(50);
                if (stopSignal) return; // Check stopSignal even while paused
            }

            if (array[j] > array[j + 1]) {
                for (let k = 0; k < bars.length; k++) {
                    if (k !== j && k !== j + 1) {
                        bars[k].style.backgroundColor = "aqua";
                    }
                }
                let temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
                bars[j].style.height = array[j] * heightFactor + "px";
                bars[j].style.backgroundColor = "lightgreen";
                //bars[j].innerText = array[j];
                bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
                bars[j + 1].style.backgroundColor = "lightgreen";
                //bars[j + 1].innerText = array[j + 1];
                await sleep(speedFactor);
            }
        }
        await sleep(speedFactor);
    }
    return array;
}

async function swap(items, leftIndex, rightIndex, bars) {
    if (stopSignal) return; // Stop sorting if reset is pressed
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
    bars[leftIndex].style.height = items[leftIndex] * heightFactor + "px";
    bars[leftIndex].style.backgroundColor = "yellow";
    //bars[leftIndex].innerText = items[leftIndex];
    bars[rightIndex].style.height = items[rightIndex] * heightFactor + "px";
    bars[rightIndex].style.backgroundColor = "yellow";
    //bars[rightIndex].innerText = items[rightIndex];
    await sleep(speedFactor);
}
async function partition(items, left, right) {
    let bars = document.getElementsByClassName("bar");

    while (isPaused) {
        await sleep(50);
        if (stopSignal) return; // Check stopSignal even while paused
    }
    if (stopSignal) return; // Stop sorting if reset is pressed


    let pivotIndex = Math.floor((right + left) / 2);
    var pivot = items[pivotIndex]; //middle element
    bars[pivotIndex].style.backgroundColor = "red";

    for (let i = 0; i < bars.length; i++) {
        if (i != pivotIndex) {
            bars[i].style.backgroundColor = "aqua";
        }
    }

    (i = left), //left pointer
    (j = right); //right pointer
    while (i <= j) {
        if (stopSignal) return; // Stop sorting if reset is pressed
        while (items[i] < pivot) {
            if (stopSignal) return; // Stop sorting if reset is pressed
            i++;
        }
        while (items[j] > pivot) {
            if (stopSignal) return; // Stop sorting if reset is pressed
            j--;
        }
        if (i <= j) {
            await swap(items, i, j, bars); //swapping two elements
            if (stopSignal) return; // Stop sorting if reset is pressed
            i++;
            j--;
        }
    }
    return i;
}

async function quickSort(items, left, right) {
    if (stopSignal) return; // Stop sorting if reset is pressed
    var index;
    let bars = document.getElementsByClassName("bar");
    if (items.length > 1) {
        index = await partition(items, left, right); //index returned from partition
        if (stopSignal) return; // Stop sorting if reset is pressed
        if (left < index - 1) {
            //more elements on the left side of the pivot
            await quickSort(items, left, index - 1);
            if (stopSignal) return; // Stop sorting if reset is pressed
        }
        if (index < right) {
            //more elements on the right side of the pivot
            await quickSort(items, index, right);
            if (stopSignal) return; // Stop sorting if reset is pressed
        }
    }

    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = "aqua";
    }
    return items;
}

// sort_btn.addEventListener("click", function () {
//   let sorted_array = quickSort(unsorted_array, 0, numOfBars - 1);
//   console.log(sorted_array);
// });


async function InsertionSort(array) {
    let bars = document.getElementsByClassName("bar");


    for (let i = 1; i < array.length; i++) {
        if (stopSignal) {
            return; // Stop sorting if reset is pressed
        }
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            if (stopSignal) {
                return; // Stop sorting if reset is pressed
            }
            while (isPaused) {
                await sleep(50);
                if (stopSignal) return; // Check stopSignal even while paused
            }

            array[j + 1] = array[j];
            bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
            bars[j + 1].style.backgroundColor = "red";
            //bars[j + 1].innerText = array[j + 1];
            await sleep(speedFactor);

            for (let k = 0; k < bars.length; k++) {
                if (k != j + 1) {
                    bars[k].style.backgroundColor = "aqua";
                }
            }
            j = j - 1;
        }
        array[j + 1] = key;
        bars[j + 1].style.height = array[j + 1] * heightFactor + "px";
        bars[j + 1].style.backgroundColor = "lightgreen";
        //bars[j + 1].innerText = array[j + 1];
        await sleep(speedFactor);
    }

    for (let k = 0; k < bars.length; k++) {
        bars[k].style.backgroundColor = "aqua";
    }
    return array;
}

async function HeapSort(array) {
    let bars = document.getElementsByClassName("bar");

    for (let i = Math.floor(array.length / 2); i >= 0; i--) {
        if (stopSignal) return; // Stop sorting if reset is pressed
        await heapify(array, array.length, i);
    }
    for (let i = array.length - 1; i >= 0; i--) {
        if (stopSignal) return; // Stop sorting if reset is pressed
        await swap(array, 0, i, bars);
        if (stopSignal) return; // Stop sorting if reset is pressed
        await heapify(array, i, 0);
    }
    for (let k = 0; k < bars.length; k++) {
        bars[k].style.backgroundColor = "aqua";
        await sleep(speedFactor);
    }
    return array;
}

async function heapify(array, n, i) {
    let bars = document.getElementsByClassName("bar");

    while (isPaused) {
        await sleep(50);
        if (stopSignal) return; // Check stopSignal even while paused
    }
    if (stopSignal) return; // Stop sorting if reset is pressed

    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }
    if (largest != i) {
        await swap(array, i, largest, bars);
        if (stopSignal) return; // Stop sorting if reset is pressed
        await heapify(array, n, largest);
    }
}

async function swap(array, i, j, bars) {
    if (stopSignal) return; // Stop sorting if reset is pressed
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    bars[i].style.height = array[i] * heightFactor + "px";
    bars[j].style.height = array[j] * heightFactor + "px";
    bars[i].style.backgroundColor = "red";
    bars[j].style.backgroundColor = "red";
    await sleep(speedFactor);

    for (let k = 0; k < bars.length; k++) {
        if (k != i && k != j) {
            bars[k].style.backgroundColor = "aqua";
        }
    }
    //bars[i].innerText = array[i];
    //bars[j].innerText = array[j];
    return array;
}

async function mergeSort(arr) {
    let bars = document.getElementsByClassName("bar");

    while (isPaused) {
        await sleep(50);
        if (stopSignal) return; // Check stopSignal even while paused
    }
    if (stopSignal) return; // Stop sorting if reset is pressed

    if (arr.length < 2) {
        return arr;
    }
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    // Recursively sort left and right halves
    await mergeSort(left);
    if (stopSignal) return; // Stop sorting if reset is pressed
    await mergeSort(right);
    if (stopSignal) return; // Stop sorting if reset is pressed

    let i = 0; // Pointer for left array
    let j = 0; // Pointer for right array
    let k = 0; // Pointer for merged array (arr)

    while (i < left.length && j < right.length) {
        if (stopSignal) return; // Stop sorting if reset is pressed
        while (isPaused) {
            await sleep(50);
            if (stopSignal) return; // Check stopSignal even while paused
        }

        if (left[i] < right[j]) {
            arr[k] = left[i];
            i++;
        } else {
            arr[k] = right[j];
            j++;
        }

        // Visualize the current element being placed
        // Note: Visualizing merge sort can be tricky with a single bar container
        // as you're merging sorted sub-arrays into a larger one.
        // This visualization attempt tries to show the current element's height change.
        bars[k].style.height = arr[k] * heightFactor + "px";
        bars[k].style.backgroundColor = "lightgreen";
        await sleep(speedFactor);
        k++;
    }

    // Copy remaining elements of left[] if any
    while (i < left.length) {
        if (stopSignal) return; // Stop sorting if reset is pressed
        while (isPaused) {
            await sleep(50);
            if (stopSignal) return; // Check stopSignal even while paused
        }
        arr[k] = left[i];
        bars[k].style.height = arr[k] * heightFactor + "px";
        bars[k].style.backgroundColor = "lightgreen";
        await sleep(speedFactor);
        i++;
        k++;
    }

    // Copy remaining elements of right[] if any
    while (j < right.length) {
        if (stopSignal) return; // Stop sorting if reset is pressed
        while (isPaused) {
            await sleep(50);
            if (stopSignal) return; // Check stopSignal even while paused
        }
        arr[k] = right[j];
        bars[k].style.height = arr[k] * heightFactor + "px";
        bars[k].style.backgroundColor = "lightgreen";
        await sleep(speedFactor);
        j++;
        k++;
    }

    // Reset all bars to default color after merging
    for (let idx = 0; idx < bars.length; idx++) {
        bars[idx].style.backgroundColor = "aqua";
    }

    return arr;
}

start_btn.addEventListener("click", async function () {
    if (isSorting && isPaused) {
        // Resume from pause
        isPaused = false;
        console.log("Resuming sorting...");
        return;
    }

    if (isSorting) return; // Already sorting, do nothing

    isSorting = true;
    stopSignal = false; // Ensure stopSignal is false when starting a new sort
    disableUI(); // disable slider, reset, etc.

    switch (algotouse) {
        case "bubble":
            currentSortPromise = bubbleSort(unsorted_array);
            break;

        case "merge":
            if (
                confirm(
                    "Merge Sort is not visualized properly. Do you want to continue?"
                )
            ) {
                currentSortPromise = mergeSort(unsorted_array);
            } else {
                enableUI();
                isSorting = false;
                return;
            }
            break;

        case "heap":
            currentSortPromise = HeapSort(unsorted_array);
            break;

        case "selection":
            currentSortPromise = selectionSort(unsorted_array);
            break;

        case "insertion":
            currentSortPromise = InsertionSort(unsorted_array);
            break;

        case "quick":
            currentSortPromise = quickSort(unsorted_array, 0, unsorted_array.length - 1);
            break;

        default:
            currentSortPromise = bubbleSort(unsorted_array);
            break;
    }

    await currentSortPromise;

    // Only set isSorting to false and enable UI if not stopped by resetSignal
    if (!stopSignal) {
        isSorting = false;
        enableUI(); // enable controls again
        console.log("Sorting complete.");
    } else {
        console.log("Sorting stopped by reset.");
    }
});



stop_btn.addEventListener("click", () => {
    if (isSorting && !isPaused) {
        isPaused = true;
        console.log("Sorting paused.");
    }
});

reset_btn.addEventListener("click", function () {
    console.log("Reset button clicked.");
    // Set stopSignal to true to immediately stop any active sorting
    stopSignal = true;
    isPaused = false; // Ensure it's not paused if we're resetting

    // Give a small delay to allow the async sorting functions to pick up the stopSignal
    setTimeout(() => {
        resetVisualizer();
    }, 100); // Adjust delay if needed
});

function disableUI() {
    slider.disabled = true;
    reset_btn.disabled = true; // Keep reset enabled during sort for hard stop
    select_algo.disabled = true;
    speed.disabled = true;
    start_btn.textContent = "Resume"; // Change text to indicate pause/resume
}

function enableUI() {
    slider.disabled = false;
    reset_btn.disabled = false;
    select_algo.disabled = false;
    speed.disabled = false;
    start_btn.textContent = "Start";
}


function resetVisualizer() {
    // Reset slider and value
    const slider = document.getElementById("slider");
    slider.value = 50;
    document.getElementById("sliderValue").textContent = 50;
    numOfBars = 50;
    maxRange = 50;

    // Reset dropdowns
    document.getElementById("algo").value = "bubble";
    document.getElementById("speed").value = "100";

    // Generate new array and render
    bars_container.innerHTML = "";
    unsorted_array = createRandomArray();
    renderBars(unsorted_array);

    // Reset control flags
    isSorting = false;
    isPaused = false;
    stopSignal = false; // Ensure stopSignal is reset for future operations
    currentSortPromise = null;

    // Re-enable UI
    enableUI();

    console.log("✅ Reset complete.");
}
