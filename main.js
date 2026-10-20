let currentCustomerIndex = 0;
let score = 0;
let hardCustomerFailCount = 0;
let playerBasket = { f1: 0, f2: 0, f3: 0, f4: 0 };
let pickedHeart = false;
let currentBGMTrack = 0;

const customers = [
    {
        name: "Nữ Khách Hàng 1",
        image: "assets/customer1.jpg",
        dialogue: "Chào tiệm! Tôi muốn mua đúng 2 bông Hoa Hồng và 3 bông Hoa Mẫu Đơn nhé.",
        target: { f1: 2, f2: 0, f3: 0, f4: 3 }
    },
    {
        name: "Nam Khách Hàng 2",
        image: "assets/customer2.jpg",
        dialogue: "Cho mình 3 bông Hoa Hồng, 1 bông Hoa Tulip và 1 bông Hoa Babi nha bạn.",
        target: { f1: 3, f2: 1, f3: 1, f4: 0 }
    },
    {
        name: "Khách Hàng 3",
        image: "assets/customer3.jpg",
        dialogue: "Chào chủ tiệm, tôi cần đặt: 1 bông Hoa Hồng, 2 bông Hoa Tulip và 3 bông Hoa Babi.",
        target: { f1: 1, f2: 2, f3: 3, f4: 0 }
    },
    {
        name: "Khách Đặc Biệt",
        image: "assets/customer4.jpg",
        dialogue: "Tôi muốn mua một bó hoa thật chân thành để tặng cho một người ở xa... Làm giúp tôi xem nào!",
        target: { f1: 1, f2: 1, f3: 1, f4: 1 }
    }
];

const shopScreen = document.getElementById('shop-screen');
const workScreen = document.getElementById('work-screen');
const endScreen = document.getElementById('end-screen');

function playBGM(trackNumber) {
    if (currentBGMTrack === trackNumber) return;

    let m1 = document.getElementById('bgm1');
    let m2 = document.getElementById('bgm2');
    let m3 = document.getElementById('bgm3');

    if (m1) { m1.pause(); m1.currentTime = 0; }
    if (m2) { m2.pause(); m2.currentTime = 0; }
    if (m3) { m3.pause(); m3.currentTime = 0; }

    let selectedMusic = document.getElementById('bgm' + trackNumber);
    if (selectedMusic) {
        selectedMusic.play().then(() => {
            currentBGMTrack = trackNumber;
        }).catch(error => {
            const unlockAudio = () => {
                selectedMusic.play().then(() => {
                    currentBGMTrack = trackNumber;
                    document.removeEventListener('click', unlockAudio);
                }).catch(e => {});
            };
            document.addEventListener('click', unlockAudio);
        });
    }
}

function playSFX(sfxId) {
    let sfx = document.getElementById(sfxId);
    if (sfx) {
        sfx.currentTime = 0;
        sfx.play().catch(error => {});
    }
}

function initGame() {
    playBGM(1);
    updateCustomerUI();
}

function updateCustomerUI() {
    if (currentCustomerIndex >= customers.length) return;
    
    let currentCus = customers[currentCustomerIndex];
    document.getElementById('customer-counter-title').innerText = `Khách hàng thứ ${currentCustomerIndex + 1} / 4`;
    document.getElementById('customer-img').src = currentCus.image;
    document.getElementById('customer-dialogue').innerHTML = `<b>${currentCus.name}:</b><br>${currentCus.dialogue}`;

    if (currentCustomerIndex === 3) {
        playBGM(2);
    }
}

function goToWork() {
    shopScreen.classList.add('hidden');
    workScreen.classList.remove('hidden');

    if (currentCustomerIndex === 3) {
        playBGM(2);
        workScreen.classList.add('shake-effect', 'dramatic-red-mode');
    } else {
        playBGM(1);
        workScreen.classList.remove('shake-effect', 'dramatic-red-mode');
    }

    updateOrderTargetText();
}

function backToShop() {
    workScreen.classList.add('hidden');
    shopScreen.classList.remove('hidden');
    workScreen.classList.remove('shake-effect', 'dramatic-red-mode');
}

function updateOrderTargetText() {
    let currentCus = customers[currentCustomerIndex];
    let t = currentCus.target;
    let parts = [];
    if (t.f1 > 0) parts.push(`${t.f1} Hoa Hồng`);
    if (t.f2 > 0) parts.push(`${t.f2} Hoa Tulip`);
    if (t.f3 > 0) parts.push(`${t.f3} Hoa Babi`);
    if (t.f4 > 0) parts.push(`${t.f4} Hoa Mẫu Đơn`);
    
    if (hardCustomerFailCount >= 3) {
        document.getElementById('order-target').innerText = "Gợi ý: Hãy nhặt [Trái Tim Của Tôi] để trao cho khách!";
    } else {
        document.getElementById('order-target').innerText = "Yêu cầu: " + parts.join(', ');
    }
    updateBasketText();
}

function pickFlower(flowerNum) {
    playerBasket['f' + flowerNum]++;
    updateBasketText();
    playSFX('sfx-pick');
}

function pickHeart() {
    pickedHeart = true;
    updateBasketText();
    playSFX('sfx-pick');
}

function updateBasketText() {
    let parts = [];
    if (playerBasket.f1 > 0) parts.push(`${playerBasket.f1} Hoa Hồng`);
    if (playerBasket.f2 > 0) parts.push(`${playerBasket.f2} Hoa Tulip`);
    if (playerBasket.f3 > 0) parts.push(`${playerBasket.f3} Hoa Babi`);
    if (playerBasket.f4 > 0) parts.push(`${playerBasket.f4} Hoa Mẫu Đơn`);
    if (pickedHeart) parts.push("❤️ Trái Tim Của Tôi");

    let displayStr = parts.length > 0 ? parts.join(', ') : "(Trống)";
    document.getElementById('current-basket').innerText = "Giỏ: " + displayStr;
}

function clearBasket() {
    playerBasket = { f1: 0, f2: 0, f3: 0, f4: 0 };
    pickedHeart = false;
    updateBasketText();
}

function submitOrder() {
    let currentCus = customers[currentCustomerIndex];

    if (currentCustomerIndex < 3) {
        let isCorrect = (
            playerBasket.f1 === currentCus.target.f1 &&
            playerBasket.f2 === currentCus.target.f2 &&
            playerBasket.f3 === currentCus.target.f3 &&
            playerBasket.f4 === currentCus.target.f4
        );

        if (isCorrect) {
            alert("Chính xác! Khách rất ưng ý.");
            score += 10;
            document.getElementById('score').innerText = "Điểm: " + score;
            clearBasket();
            currentCustomerIndex++;
            backToShop();
            updateCustomerUI();
        } else {
            alert("Khách bảo chưa đúng ý! Dùng thùng rác làm lại nhé.");
            clearBasket();
        }
    } 
    else {
        if (pickedHeart) {
            alert(`Khách mỉm cười xúc động: "Đây chính là món quà chân thành và ấm áp nhất! Tôi xin dành tặng lại trái tim này cho chính người bán hoa nhé!"`);
            
            shopScreen.classList.add('hidden');
            workScreen.classList.add('hidden');
            endScreen.classList.remove('hidden');
            workScreen.classList.remove('shake-effect', 'dramatic-red-mode');
            playBGM(3);
            return;
        }

        hardCustomerFailCount++;
        if (hardCustomerFailCount < 3) {
            alert(`Khách lắc đầu: "Bó hoa này vẫn chưa đủ chân thành để gửi đi xa..." (Lần thử ${hardCustomerFailCount}/3)`);
            clearBasket();
            backToShop();
        } else {
            alert(`Khách thở dài: "Vẫn chưa thấy tấm chân tình nào..."\n\n💡 (Bạn chợt nhận ra và lấy Trái Tim của chính mình ra trên kệ hoa!)`);
            document.getElementById('heart-btn').classList.remove('hidden');
            clearBasket();
            backToShop();
            document.getElementById('customer-dialogue').innerHTML = `<b>Khách Đặc Biệt:</b><br>Hãy thử cho tôi thứ chân thành nhất từ chính bạn xem sao...`;
        }
    }
}

initGame();