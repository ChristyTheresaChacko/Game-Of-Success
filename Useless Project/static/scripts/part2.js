const targetContainer = document.querySelector(".target");
const resultPage = document.querySelector("#resultPage");
const button = resultPage.querySelector("button");

let targetCard = null;

function areArraysEqual(arr1, arr2) 
{
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function shuffleArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function createCard(digit, status="active")
{
    const card = document.createElement("span");
    card.classList.add("digit");
    if(status == "active")
    {
        card.innerHTML = digit;
        card.classList.add("active");
        card.setAttribute("draggable", true);
    }
    else
        card.classList.add("inactive");
    return card;
}

function initContainers(numeric)
{
    let data = String(numeric).split("");
    let newData = shuffleArray(data);
    let cardCount = data.length;
    let containers = document.querySelectorAll(".container");
    for(let i=0; i < cardCount; i++)
    {
        let card_active = createCard(newData[i]);
        let card_inactive = createCard(newData[i], "inactive");
        containers[0].appendChild(card_active);
        containers[1].appendChild(card_inactive);
    }

    const cards = document.querySelectorAll(".digit");
    cards.forEach(card => {
        card.addEventListener("dragstart", () => targetCard = card);
        card.addEventListener("dragend", () => targetCard = null);
        card.addEventListener("dragover", (event) => event.preventDefault());
        card.addEventListener("drop", () => {
            const parentNew = card.parentElement;
            const parentOld = targetCard.parentElement;
            const newCards = [...parentNew.querySelectorAll(".digit")];
            const index = newCards.indexOf(card);
            const nextCard = newCards[index+1];
            parentOld.insertBefore(card, targetCard);
            parentNew.insertBefore(targetCard, nextCard);
            let arr = [...targetContainer.querySelectorAll(".active")];
            if(arr.length != cardCount)
                targetContainer.classList.remove("correct");
            else
            {
                let digits = arr.map(card => card.innerHTML);
                console.log(digits)
                if(areArraysEqual(digits, data))
                {
                    targetContainer.classList.add("correct");
                    resultPage.classList.add("active");
                }
                else
                    targetContainer.classList.remove("correct");
            }
        });
    });
}



button.addEventListener("click", () => {
    window.location.href = "rewardGame";
});

let value = resourceData["resource1"] + resourceData["resource2"]
initContainers(value);

