"use strict";

/* =========================================================
   ALEE v6 // CYBER OPS
   Browser-only educational toolkit
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const STORAGE = {
    usage: "alee_usage",
    favorites: "alee_favorites",
    history: "alee_history",
    notes: "alee_notes",
    theme: "alee_theme",
    cyberXP: "alee_cyber_xp"
};

let usage = Number(localStorage.getItem(STORAGE.usage) || 0);
let favorites = JSON.parse(
    localStorage.getItem(STORAGE.favorites) || "[]"
);
let history = JSON.parse(
    localStorage.getItem(STORAGE.history) || "[]"
);

let timerInterval = null;
let timerSeconds = 0;

let stopwatchInterval = null;
let stopwatchSeconds = 0;


/* =========================================================
   CYBER LAB STATE
========================================================= */

let cyberLabState = {
    score: Number(
        localStorage.getItem(STORAGE.cyberXP) || 0
    ),
    challenge: null,
    challengeSolved: false
};


/* =========================================================
   BASIC UI
========================================================= */

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({
        behavior: "smooth"
    });
}


function showToast(message) {
    const toast = $("#toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


function openModal(content) {
    $("#modalContent").innerHTML = content;
    $("#modal").classList.add("active");
}


function closeModal() {
    $("#modal").classList.remove("active");
}


$("#closeModal").addEventListener(
    "click",
    closeModal
);


$("#modal").addEventListener("click", (event) => {
    if (event.target === $("#modal")) {
        closeModal();
    }
});


/* =========================================================
   USAGE + HISTORY
========================================================= */

function registerTool(name) {
    usage++;

    localStorage.setItem(
        STORAGE.usage,
        usage
    );

    history.unshift({
        name,
        time: new Date().toLocaleString()
    });

    history = history.slice(0, 30);

    localStorage.setItem(
        STORAGE.history,
        JSON.stringify(history)
    );

    updateStats();
}


function updateStats() {
    $("#toolCount").textContent =
        document.querySelectorAll(".tool-card").length;

    $("#usedCount").textContent = usage;

    $("#favoriteCount").textContent =
        favorites.length;
}


function openTool(id) {

    const toolNames = {

        passwordTool: "Password Generator",
        strengthTool: "Password Strength",
        hashTool: "Hash Lab",
        base64Tool: "Base64 Lab",
        jwtTool: "JWT Decoder",
        regexTool: "Regex Tester",
        urlTool: "URL Encoder",
        reconTool: "Recon Engine",
        packetTool: "Packet Visualizer",
        webIntelTool: "Web Intel",
        cyberLabTool: "Cyber Lab",
        jsonTool: "JSON Formatter",

        sensitivityTool: "Sensitivity Converter",
        edpiTool: "eDPI Calculator",
        fpsTool: "FPS / Hz Calculator",
        timerTool: "Gaming Timer",
        stopwatchTool: "Stopwatch",

        calculatorTool: "Calculator",
        notesTool: "Quick Notes",
        unitTool: "Unit Converter",
        colorTool: "Color Picker",
        activityTool: "Activity History"
    };


    if (toolNames[id]) {
        registerTool(toolNames[id]);
    }


    const tools = {

        passwordTool: passwordTool,
        strengthTool: strengthTool,
        hashTool: hashTool,
        base64Tool: base64Tool,
        jwtTool: jwtTool,
        regexTool: regexTool,
        urlTool: urlTool,
        reconTool: reconTool,
        packetTool: packetTool,
        webIntelTool: webIntelTool,
        cyberLabTool: cyberLabTool,
        jsonTool: jsonTool,

        sensitivityTool: sensitivityTool,
        edpiTool: edpiTool,
        fpsTool: fpsTool,
        timerTool: timerTool,
        stopwatchTool: stopwatchTool,

        calculatorTool: calculatorTool,
        notesTool: notesTool,
        unitTool: unitTool,
        colorTool: colorTool,
        activityTool: activityTool
    };


    if (tools[id]) {
        openModal(tools[id]());
    }
}


/* =========================================================
   PASSWORD GENERATOR
========================================================= */

function passwordTool() {

    return `
        <div>
            <h2>🔐 Password Generator</h2>

            <p>
                Generate a strong password locally
                in your browser.
            </p>

            <div class="tool-form">

                <input
                    id="passwordLength"
                    type="number"
                    min="8"
                    max="128"
                    value="20"
                >

                <label>
                    <input
                        id="passwordSymbols"
                        type="checkbox"
                        checked
                    >
                    Include symbols
                </label>

                <button
                    class="primary-btn"
                    onclick="generatePassword()"
                >
                    Generate
                </button>

                <div
                    id="passwordResult"
                    class="result"
                >
                    Click generate.
                </div>

                <button
                    class="secondary-btn copy-btn"
                    onclick="copyText('#passwordResult')"
                >
                    Copy
                </button>

            </div>
        </div>
    `;
}


function generatePassword() {

    const length = Math.min(
        128,
        Math.max(
            8,
            Number($("#passwordLength").value) || 20
        )
    );

    const symbols =
        $("#passwordSymbols").checked;

    let chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789";

    if (symbols) {
        chars +=
            "!@#$%^&*()-_=+[]{};:,.?";
    }

    const array =
        new Uint32Array(length);

    crypto.getRandomValues(array);

    let result = "";

    for (let i = 0; i < length; i++) {
        result +=
            chars[array[i] % chars.length];
    }

    $("#passwordResult").textContent =
        result;
}


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

function strengthTool() {

    return `
        <div>

            <h2>🛡️ Password Strength</h2>

            <p>
                Evaluate a password locally
                without sending it anywhere.
            </p>

            <div class="tool-form">

                <input
                    id="strengthInput"
                    type="password"
                    placeholder="Enter password"
                >

                <button
                    class="primary-btn"
                    onclick="checkStrength()"
                >
                    Analyze
                </button>

                <div
                    id="strengthResult"
                    class="result"
                >
                    Waiting for input...
                </div>

            </div>

        </div>
    `;
}


function checkStrength() {

    const value =
        $("#strengthInput").value;

    let score = 0;

    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    let label = "Very Weak";

    if (score >= 5) {
        label = "Strong";
    } else if (score >= 4) {
        label = "Good";
    } else if (score >= 2) {
        label = "Weak";
    }

    $("#strengthResult").textContent =
        `Strength: ${label}\nScore: ${score}/6`;
}


/* =========================================================
   HASH
========================================================= */

function hashTool() {

    return `
        <div>

            <h2>#️⃣ Hash Lab</h2>

            <p>
                Generate a SHA-256 hash
                from supplied text.
            </p>

            <div class="tool-form">

                <textarea
                    id="hashInput"
                    placeholder="Enter text"
                ></textarea>

                <button
                    class="primary-btn"
                    onclick="createHash()"
                >
                    Generate SHA-256
                </button>

                <div
                    id="hashResult"
                    class="result"
                >
                    Result will appear here.
                </div>

                <button
                    class="secondary-btn copy-btn"
                    onclick="copyText('#hashResult')"
                >
                    Copy Hash
                </button>

            </div>

        </div>
    `;
}


async function createHash() {

    const text =
        $("#hashInput").value;

    const data =
        new TextEncoder().encode(text);

    const buffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hash =
        [...new Uint8Array(buffer)]
            .map(byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
            )
            .join("");

    $("#hashResult").textContent =
        hash;
}


/* =========================================================
   BASE64
========================================================= */

function base64Tool() {

    return `
        <div>

            <h2>🔤 Base64 Lab</h2>

            <div class="tool-form">

                <textarea
                    id="base64Input"
                    placeholder="Enter text"
                ></textarea>

                <button
                    class="primary-btn"
                    onclick="encodeBase64()"
                >
                    Encode
                </button>

                <button
                    class="secondary-btn"
                    onclick="decodeBase64()"
                >
                    Decode
                </button>

                <div
                    id="base64Result"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function encodeBase64() {

    const value =
        $("#base64Input").value;

    $("#base64Result").textContent =
        btoa(
            unescape(
                encodeURIComponent(value)
            )
        );
}


function decodeBase64() {

    try {

        const value =
            $("#base64Input").value;

        $("#base64Result").textContent =
            decodeURIComponent(
                escape(atob(value))
            );

    } catch {

        $("#base64Result").textContent =
            "Invalid Base64 data.";
    }
}


/* =========================================================
   JWT DECODER
========================================================= */

function jwtTool() {

    return `
        <div>

            <h2>🪪 JWT Decoder</h2>

            <p>
                Decode the header and payload
                of a JWT locally.
                This does not verify signatures.
            </p>

            <div class="tool-form">

                <textarea
                    id="jwtInput"
                    placeholder="Paste JWT here"
                ></textarea>

                <button
                    class="primary-btn"
                    onclick="decodeJWT()"
                >
                    Decode
                </button>

                <div
                    id="jwtResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function decodeJWT() {

    const token =
        $("#jwtInput").value.trim();

    try {

        const parts =
            token.split(".");

        if (parts.length !== 3) {
            throw new Error(
                "Invalid JWT structure."
            );
        }

        const decodePart = (part) => {

            const normalized =
                part
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");

            return JSON.parse(
                decodeURIComponent(
                    escape(
                        atob(normalized)
                    )
                )
            );
        };

        const header =
            decodePart(parts[0]);

        const payload =
            decodePart(parts[1]);

        $("#jwtResult").textContent =
            "HEADER\n" +
            JSON.stringify(
                header,
                null,
                2
            ) +
            "\n\nPAYLOAD\n" +
            JSON.stringify(
                payload,
                null,
                2
            );

    } catch (error) {

        $("#jwtResult").textContent =
            "Unable to decode JWT: " +
            error.message;
    }
}


/* =========================================================
   REGEX TESTER
========================================================= */

function regexTool() {

    return `
        <div>

            <h2>🧪 Regex Tester</h2>

            <p>
                Test regular expressions
                against your own text.
            </p>

            <div class="tool-form">

                <input
                    id="regexPattern"
                    placeholder="Example: ^[A-Z]+$"
                >

                <textarea
                    id="regexText"
                    placeholder="Text to test"
                ></textarea>

                <button
                    class="primary-btn"
                    onclick="testRegex()"
                >
                    Test Pattern
                </button>

                <div
                    id="regexResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function testRegex() {

    try {

        const pattern =
            $("#regexPattern").value;

        const text =
            $("#regexText").value;

        const regex =
            new RegExp(pattern);

        const match =
            text.match(regex);

        $("#regexResult").textContent =
            match
                ? `MATCH FOUND\n${match[0]}`
                : "NO MATCH";

    } catch {

        $("#regexResult").textContent =
            "Invalid regular expression.";
    }
}


/* =========================================================
   URL TOOL
========================================================= */

function urlTool() {

    return `
        <div>

            <h2>🔗 URL Encoder</h2>

            <div class="tool-form">

                <textarea
                    id="urlInput"
                    placeholder="Enter URL/text"
                ></textarea>

                <button
                    class="primary-btn"
                    onclick="encodeURL()"
                >
                    Encode
                </button>

                <button
                    class="secondary-btn"
                    onclick="decodeURL()"
                >
                    Decode
                </button>

                <div
                    id="urlResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function encodeURL() {

    $("#urlResult").textContent =
        encodeURIComponent(
            $("#urlInput").value
        );
}


function decodeURL() {

    try {

        $("#urlResult").textContent =
            decodeURIComponent(
                $("#urlInput").value
            );

    } catch {

        $("#urlResult").textContent =
            "Invalid encoded URL.";
    }
}


/* =========================================================
   RECON ENGINE
========================================================= */

function reconTool() {

    return `
        <div>

            <h2>🛰️ Recon Engine</h2>

            <p>
                Browser-side environment inspection.
                This only examines information
                exposed to your own browser.
            </p>

            <div class="tool-form">

                <button
                    class="primary-btn"
                    onclick="runRecon()"
                >
                    Start Local Recon
                </button>

                <div
                    id="reconResult"
                    class="result"
                >
                    Ready.
                </div>

            </div>

        </div>
    `;
}


function runRecon() {

    const connection =
        navigator.connection;

    const result = [

        `USER AGENT: ${navigator.userAgent}`,

        `PLATFORM: ${navigator.platform}`,

        `LANGUAGE: ${navigator.language}`,

        `CPU THREADS: ${
            navigator.hardwareConcurrency ||
            "Unknown"
        }`,

        `MEMORY: ${
            navigator.deviceMemory
                ? navigator.deviceMemory + " GB"
                : "Unavailable"
        }`,

        `ONLINE: ${
            navigator.onLine
                ? "YES"
                : "NO"
        }`,

        `SCREEN: ${
            screen.width
        } x ${
            screen.height
        }`,

        `COLOR DEPTH: ${
            screen.colorDepth
        }`,

        `TIMEZONE: ${
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone
        }`,

        `CONNECTION: ${
            connection?.effectiveType ||
            "Unavailable"
        }`,

        `DOWNLINK: ${
            connection?.downlink
                ? connection.downlink +
                  " Mbps"
                : "Unavailable"
        }`

    ].join("\n");

    $("#reconResult").textContent =
        result;
}


/* =========================================================
   PACKET VISUALIZER
========================================================= */

function packetTool() {

    return `
        <div>

            <h2>📡 Packet Visualizer</h2>

            <p>
                Educational simulation of
                network traffic.
                No real packet interception
                is performed.
            </p>

            <div class="tool-form">

                <button
                    class="primary-btn"
                    onclick="startPacketSimulation()"
                >
                    Start Simulation
                </button>

                <div
                    id="packetResult"
                    class="result"
                >
                    Simulation offline.
                </div>

            </div>

        </div>
    `;
}


function startPacketSimulation() {

    const output =
        $("#packetResult");

    output.textContent =
        "INITIALIZING SIMULATION...\n";

    let count = 0;

    const interval =
        setInterval(() => {

            count++;

            const types = [
                "TCP",
                "UDP",
                "HTTPS",
                "DNS"
            ];

            const type =
                types[
                    Math.floor(
                        Math.random() *
                        types.length
                    )
                ];

            const size =
                Math.floor(
                    Math.random() * 1400
                ) + 64;

            output.textContent +=
                `[${String(count).padStart(2, "0")}] ` +
                `${type.padEnd(5)} ` +
                `SIMULATED_PACKET ` +
                `${size} bytes\n`;

            if (count >= 15) {

                clearInterval(interval);

                output.textContent +=
                    "\nSIMULATION COMPLETE.";
            }

            output.scrollTop =
                output.scrollHeight;

        }, 180);
}


/* =========================================================
   WEB INTEL
========================================================= */

function webIntelTool() {

    return `
        <div>

            <h2>🌐 Web Intel</h2>

            <p>
                Inspect basic public URL information.
                No credential access or
                private-data collection.
            </p>

            <div class="tool-form">

                <input
                    id="webIntelInput"
                    placeholder="https://example.com"
                >

                <button
                    class="primary-btn"
                    onclick="analyzeURL()"
                >
                    Analyze
                </button>

                <div
                    id="webIntelResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function analyzeURL() {

    try {

        const value =
            $("#webIntelInput")
                .value
                .trim();

        const url =
            new URL(value);

        $("#webIntelResult").textContent =
            [
                `PROTOCOL: ${url.protocol}`,
                `HOSTNAME: ${url.hostname}`,
                `PORT: ${url.port || "Default"}`,
                `PATH: ${url.pathname || "/"}`,
                `QUERY: ${url.search || "None"}`,
                `HASH: ${url.hash || "None"}`,
                `HTTPS: ${
                    url.protocol === "https:"
                        ? "YES"
                        : "NO"
                }`
            ].join("\n");

    } catch {

        $("#webIntelResult").textContent =
            "Invalid URL.";
    }
}


/* =========================================================
   CYBER LAB v6
========================================================= */

function getCyberRank() {

    if (cyberLabState.score >= 300) {
        return "LAB OPERATIVE";
    }

    if (cyberLabState.score >= 200) {
        return "SECURITY TRAINEE";
    }

    if (cyberLabState.score >= 100) {
        return "LAB ROOKIE";
    }

    return "NEW RECRUIT";
}


function saveCyberXP() {

    localStorage.setItem(
        STORAGE.cyberXP,
        String(cyberLabState.score)
    );
}


function addCyberXP(amount) {

    cyberLabState.score += amount;

    saveCyberXP();

    const xp =
        document.querySelector("#cyberXP");

    const rank =
        document.querySelector("#cyberRank");

    if (xp) {
        xp.textContent =
            cyberLabState.score;
    }

    if (rank) {
        rank.textContent =
            getCyberRank();
    }
}


function cyberLabTool() {

    const scenarios = [

        {
            title: "Suspicious Login Message",

            text:
                "You receive a message claiming " +
                "your account will be locked unless " +
                "you sign in through a provided link.",

            correct: "verify"
        },

        {
            title: "Weak Password Alert",

            text:
                "A security check warns that you " +
                "are using the same password on " +
                "multiple accounts.",

            correct: "verify"
        },

        {
            title: "Unknown Public Wi-Fi",

            text:
                "You see an unfamiliar public Wi-Fi " +
                "network with a name similar to a " +
                "nearby café.",

            correct: "verify"
        }

    ];


    const scenario =
        scenarios[
            Math.floor(
                Math.random() *
                scenarios.length
            )
        ];


    cyberLabState.challenge =
        scenario;

    cyberLabState.challengeSolved =
        false;


    return `
        <div>

            <h2>🧪 Cyber Lab</h2>

            <p>
                Safe browser-only security
                simulations for learning
                defensive cybersecurity concepts.
            </p>


            <div class="result warning">

                SAFE MODE ACTIVE

                <br><br>

                No real systems are scanned.
                <br>
                No real packets are intercepted.
                <br>
                No credentials are collected.

            </div>


            <h3 style="margin-top:25px;">
                🛡️ Defense Challenge
            </h3>


            <div class="tool-form">

                <div class="result">

                    SCENARIO

                    <br><br>

                    ${escapeHTML(
                        scenario.title
                    )}

                    <br><br>

                    ${escapeHTML(
                        scenario.text
                    )}

                </div>


                <button
                    class="primary-btn"
                    onclick="runDefenseChallenge('verify')"
                >
                    Verify Through Official Source
                </button>


                <button
                    class="secondary-btn"
                    onclick="runDefenseChallenge('ignore')"
                >
                    Ignore
                </button>


                <button
                    class="secondary-btn"
                    onclick="runDefenseChallenge('share')"
                >
                    Share With Friends
                </button>


                <button
                    class="secondary-btn"
                    onclick="runDefenseChallenge('reuse')"
                >
                    Reuse Password Elsewhere
                </button>


                <div
                    id="challengeResult"
                    class="result"
                >
                    Choose a response.
                </div>

            </div>


            <h3 style="margin-top:30px;">
                📡 Port Activity Simulator
            </h3>


            <p>
                Educational simulation only.
                No real network requests
                are performed.
            </p>


            <div class="tool-form">

                <button
                    class="primary-btn"
                    onclick="runPortSimulation()"
                >
                    Start Simulation
                </button>


                <div
                    id="portSimulationResult"
                    class="result"
                >
                    Simulation offline.
                </div>

            </div>


            <h3 style="margin-top:30px;">
                🏆 Lab Progress
            </h3>


            <div class="result">

                XP:
                <strong id="cyberXP">
                    ${cyberLabState.score}
                </strong>

                <br><br>

                RANK:
                <strong id="cyberRank">
                    ${getCyberRank()}
                </strong>

            </div>

        </div>
    `;
}


function runDefenseChallenge(response) {

    const result =
        document.querySelector(
            "#challengeResult"
        );

    if (
        !result ||
        !cyberLabState.challenge
    ) {
        return;
    }


    if (
        response ===
        cyberLabState.challenge.correct
    ) {

        if (
            !cyberLabState.challengeSolved
        ) {

            cyberLabState.challengeSolved =
                true;

            addCyberXP(100);

            result.textContent =
                "CORRECT\n\n" +
                "+100 XP\n" +
                "Good defensive decision: " +
                "verify suspicious requests " +
                "through an official source.";

            result.className =
                "result";

        } else {

            result.textContent =
                "Challenge already completed.";
        }

        return;
    }


    result.textContent =
        "NOT THE BEST DEFENSIVE RESPONSE.\n\n" +
        "Avoid acting on suspicious requests " +
        "directly. Verify through a trusted " +
        "official source.";

    result.className =
        "result warning";
}


function runPortSimulation() {

    const output =
        document.querySelector(
            "#portSimulationResult"
        );

    if (!output) {
        return;
    }


    const services = [

        ["22", "SSH"],
        ["53", "DNS"],
        ["80", "HTTP"],
        ["443", "HTTPS"],
        ["8080", "WEB-ALT"],
        ["3306", "DATABASE"]

    ];


    output.textContent =
        "INITIALIZING SAFE SIMULATION...\n\n";


    let index = 0;


    const interval =
        setInterval(() => {

            if (
                index >=
                services.length
            ) {

                clearInterval(interval);

                output.textContent +=
                    "\nSIMULATION COMPLETE.\n" +
                    "NO REAL NETWORK TRAFFIC " +
                    "WAS GENERATED.";

                return;
            }


            const [
                port,
                service
            ] = services[index];


            output.textContent +=
                `[SIMULATED] PORT ${port} // ` +
                `${service} // CLOSED/OPEN DEMO\n`;


            index++;

            output.scrollTop =
                output.scrollHeight;

        }, 350);
}


/* =========================================================
   JSON FORMATTER
========================================================= */

function jsonTool() {

    return `
        <div>

            <h2>📦 JSON Formatter</h2>

            <div class="tool-form">

                <textarea
                    id="jsonInput"
                    placeholder='{"name":"ALEE"}'
                ></textarea>

                <button
                    class="primary-btn"
                    onclick="formatJSON()"
                >
                    Format JSON
                </button>

                <div
                    id="jsonResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function formatJSON() {

    try {

        const parsed =
            JSON.parse(
                $("#jsonInput").value
            );

        $("#jsonResult").textContent =
            JSON.stringify(
                parsed,
                null,
                2
            );

    } catch {

        $("#jsonResult").textContent =
            "Invalid JSON.";
    }
}


/* =========================================================
   GAMING
========================================================= */

function sensitivityTool() {

    return `
        <div>

            <h2>🎯 Sensitivity Converter</h2>

            <div class="tool-form">

                <input
                    id="sensValue"
                    type="number"
                    step="0.01"
                    placeholder="Sensitivity"
                >

                <input
                    id="sensRatio"
                    type="number"
                    step="0.01"
                    value="1"
                    placeholder="Conversion ratio"
                >

                <button
                    class="primary-btn"
                    onclick="convertSensitivity()"
                >
                    Convert
                </button>

                <div
                    id="sensResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function convertSensitivity() {

    const value =
        Number($("#sensValue").value);

    const ratio =
        Number($("#sensRatio").value);

    if (
        !Number.isFinite(value) ||
        !Number.isFinite(ratio)
    ) {

        $("#sensResult").textContent =
            "Enter valid numbers.";

        return;
    }

    $("#sensResult").textContent =
        `Converted Sensitivity: ${
            (value * ratio).toFixed(3)
        }`;
}


function edpiTool() {

    return `
        <div>

            <h2>🖱️ eDPI Calculator</h2>

            <div class="tool-form">

                <input
                    id="dpiValue"
                    type="number"
                    placeholder="Mouse DPI"
                >

                <input
                    id="gameSens"
                    type="number"
                    step="0.01"
                    placeholder="Game sensitivity"
                >

                <button
                    class="primary-btn"
                    onclick="calculateEDPI()"
                >
                    Calculate eDPI
                </button>

                <div
                    id="edpiResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function calculateEDPI() {

    const dpi =
        Number($("#dpiValue").value);

    const sens =
        Number($("#gameSens").value);

    if (
        dpi <= 0 ||
        sens <= 0
    ) {

        $("#edpiResult").textContent =
            "Enter valid values.";

        return;
    }

    $("#edpiResult").textContent =
        `eDPI: ${
            (dpi * sens).toFixed(2)
        }`;
}


function fpsTool() {

    return `
        <div>

            <h2>🖥️ FPS / Hz Calculator</h2>

            <div class="tool-form">

                <input
                    id="fpsValue"
                    type="number"
                    placeholder="FPS"
                >

                <input
                    id="hzValue"
                    type="number"
                    placeholder="Monitor Hz"
                >

                <button
                    class="primary-btn"
                    onclick="calculateFPS()"
                >
                    Analyze
                </button>

                <div
                    id="fpsResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function calculateFPS() {

    const fps =
        Number($("#fpsValue").value);

    const hz =
        Number($("#hzValue").value);

    if (
        fps <= 0 ||
        hz <= 0
    ) {

        $("#fpsResult").textContent =
            "Enter valid values.";

        return;
    }

    const ratio =
        fps / hz;

    $("#fpsResult").textContent =
        `FPS: ${fps}\n` +
        `Display Refresh: ${hz} Hz\n` +
        `FPS / Hz Ratio: ${ratio.toFixed(2)}\n\n` +
        (
            fps >= hz
                ? "FPS is at or above the display refresh rate."
                : "FPS is below the display refresh rate."
        );
}


function timerTool() {

    return `
        <div>

            <h2>⏱️ Gaming Timer</h2>

            <div class="tool-form">

                <input
                    id="timerMinutes"
                    type="number"
                    min="1"
                    placeholder="Minutes"
                >

                <button
                    class="primary-btn"
                    onclick="startGamingTimer()"
                >
                    Start Timer
                </button>

                <button
                    class="secondary-btn"
                    onclick="stopGamingTimer()"
                >
                    Stop
                </button>

                <div
                    id="timerResult"
                    class="result"
                >
                    00:00
                </div>

            </div>

        </div>
    `;
}


function startGamingTimer() {

    clearInterval(timerInterval);

    timerSeconds =
        Math.max(
            1,
            Number(
                $("#timerMinutes").value
            ) || 1
        ) * 60;


    timerInterval =
        setInterval(() => {

            timerSeconds--;

            updateTimerDisplay();

            if (
                timerSeconds <= 0
            ) {

                clearInterval(
                    timerInterval
                );

                showToast(
                    "Gaming timer complete."
                );
            }

        }, 1000);


    updateTimerDisplay();
}


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );

    const seconds =
        timerSeconds % 60;

    $("#timerResult").textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
}


function stopGamingTimer() {

    clearInterval(
        timerInterval
    );

    showToast(
        "Gaming timer stopped."
    );
}


function stopwatchTool() {

    return `
        <div>

            <h2>⏱️ Stopwatch</h2>

            <div class="tool-form">

                <div
                    id="stopwatchResult"
                    class="result"
                >
                    00:00:00
                </div>

                <button
                    class="primary-btn"
                    onclick="startStopwatch()"
                >
                    Start
                </button>

                <button
                    class="secondary-btn"
                    onclick="stopStopwatch()"
                >
                    Stop
                </button>

                <button
                    class="secondary-btn"
                    onclick="resetStopwatch()"
                >
                    Reset
                </button>

            </div>

        </div>
    `;
}


function startStopwatch() {

    if (stopwatchInterval) {
        return;
    }

    stopwatchInterval =
        setInterval(() => {

            stopwatchSeconds++;

            const h =
                Math.floor(
                    stopwatchSeconds / 3600
                );

            const m =
                Math.floor(
                    (stopwatchSeconds % 3600) /
                    60
                );

            const s =
                stopwatchSeconds % 60;

            $("#stopwatchResult")
                .textContent =
                `${String(h).padStart(2, "0")}:` +
                `${String(m).padStart(2, "0")}:` +
                `${String(s).padStart(2, "0")}`;

        }, 1000);
}


function stopStopwatch() {

    clearInterval(
        stopwatchInterval
    );

    stopwatchInterval = null;
}


function resetStopwatch() {

    stopStopwatch();

    stopwatchSeconds = 0;

    $("#stopwatchResult")
        .textContent =
        "00:00:00";
}


/* =========================================================
   CALCULATOR
========================================================= */

function calculatorTool() {

    return `
        <div>

            <h2>🧮 Calculator</h2>

            <div class="tool-form">

                <input
                    id="calcInput"
                    placeholder="Example: 25 * 4 + 10"
                >

                <button
                    class="primary-btn"
                    onclick="calculate()"
                >
                    Calculate
                </button>

                <div
                    id="calcResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function calculate() {

    const expression =
        $("#calcInput")
            .value
            .trim();


    if (
        !/^[0-9+*/().%\s-]+$/.test(
            expression
        )
    ) {

        $("#calcResult").textContent =
            "Only basic mathematical expressions are allowed.";

        return;
    }


    try {

        const result =
            Function(
                `"use strict"; return (${expression})`
            )();


        if (!Number.isFinite(result)) {
            throw new Error();
        }


        $("#calcResult").textContent =
            String(result);

    } catch {

        $("#calcResult").textContent =
            "Invalid calculation.";
    }
}


/* =========================================================
   NOTES
========================================================= */

function notesTool() {

    const saved =
        localStorage.getItem(
            STORAGE.notes
        ) || "";


    return `
        <div>

            <h2>📝 Quick Notes</h2>

            <div class="tool-form">

                <textarea
                    id="notesInput"
                    placeholder="Write your notes..."
                >${escapeHTML(saved)}</textarea>

                <button
                    class="primary-btn"
                    onclick="saveNotes()"
                >
                    Save Notes
                </button>

                <button
                    class="secondary-btn"
                    onclick="clearNotes()"
                >
                    Clear
                </button>

            </div>

        </div>
    `;
}


function saveNotes() {

    localStorage.setItem(
        STORAGE.notes,
        $("#notesInput").value
    );

    showToast(
        "Notes saved locally."
    );
}


function clearNotes() {

    $("#notesInput").value = "";

    localStorage.removeItem(
        STORAGE.notes
    );

    showToast(
        "Notes cleared."
    );
}


/* =========================================================
   UNIT CONVERTER
========================================================= */

function unitTool() {

    return `
        <div>

            <h2>📏 Unit Converter</h2>

            <div class="tool-form">

                <input
                    id="unitValue"
                    type="number"
                    placeholder="Value"
                >

                <select id="unitType">

                    <option value="km-mi">
                        Kilometers → Miles
                    </option>

                    <option value="mi-km">
                        Miles → Kilometers
                    </option>

                    <option value="c-f">
                        Celsius → Fahrenheit
                    </option>

                    <option value="f-c">
                        Fahrenheit → Celsius
                    </option>

                    <option value="kg-lb">
                        Kilograms → Pounds
                    </option>

                    <option value="lb-kg">
                        Pounds → Kilograms
                    </option>

                </select>

                <button
                    class="primary-btn"
                    onclick="convertUnit()"
                >
                    Convert
                </button>

                <div
                    id="unitResult"
                    class="result"
                ></div>

            </div>

        </div>
    `;
}


function convertUnit() {

    const value =
        Number(
            $("#unitValue").value
        );

    const type =
        $("#unitType").value;


    if (!Number.isFinite(value)) {

        $("#unitResult").textContent =
            "Enter a valid number.";

        return;
    }


    let result;


    switch (type) {

        case "km-mi":
            result =
                value * 0.621371;
            break;

        case "mi-km":
            result =
                value * 1.609344;
            break;

        case "c-f":
            result =
                (value * 9 / 5) + 32;
            break;

        case "f-c":
            result =
                (value - 32) * 5 / 9;
            break;

        case "kg-lb":
            result =
                value * 2.20462;
            break;

        case "lb-kg":
            result =
                value * 0.453592;
            break;
    }


    $("#unitResult").textContent =
        result.toFixed(4);
}


/* =========================================================
   COLOR PICKER
========================================================= */

function colorTool() {

    return `
        <div>

            <h2>🎨 Color Picker</h2>

            <div class="tool-form">

                <input
                    id="colorInput"
                    type="color"
                    value="#00ff9d"
                >

                <button
                    class="primary-btn"
                    onclick="showColor()"
                >
                    Get Color
                </button>

                <div
                    id="colorResult"
                    class="result"
                >
                    #00ff9d
                </div>

            </div>

        </div>
    `;
}


function showColor() {

    const value =
        $("#colorInput").value;

    $("#colorResult").textContent =
        value.toUpperCase();
}


/* =========================================================
   ACTIVITY HISTORY
========================================================= */

function activityTool() {

    if (!history.length) {

        return `
            <div>

                <h2>📜 Activity History</h2>

                <p>
                    No tools have been used yet.
                </p>

            </div>
        `;
    }


    const items =
        history
            .map(item => `
                <div class="activity-item">

                    <span>
                        ${escapeHTML(item.name)}
                    </span>

                    <small>
                        ${escapeHTML(item.time)}
                    </small>

                </div>
            `)
            .join("");


    return `
        <div>

            <h2>📜 Activity History</h2>

            <p>
                Your recent ALEE activity
                is stored locally.
            </p>

            <div class="activity-list">
                ${items}
            </div>

            <button
                class="secondary-btn copy-btn"
                onclick="clearHistory()"
            >
                Clear History
            </button>

        </div>
    `;
}


/*
   FIX:
   Do not call openTool() here because
   openTool() registers the tool again.
*/

function clearHistory() {

    history = [];

    localStorage.removeItem(
        STORAGE.history
    );

    showToast(
        "Activity history cleared."
    );

    openModal(
        activityTool()
    );
}


/* =========================================================
   COPY
========================================================= */

async function copyText(selector) {

    const element =
        document.querySelector(selector);

    if (!element) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            element.textContent
        );

        showToast(
            "Copied to clipboard."
        );

    } catch {

        showToast(
            "Clipboard access unavailable."
        );
    }
}


/* =========================================================
   FAVORITES
========================================================= */

function setupFavorites() {

    $$(".favorite").forEach(button => {

        const tool =
            button.dataset.tool;


        if (
            favorites.includes(tool)
        ) {

            button.classList.add(
                "active"
            );

            button.textContent =
                "★";
        }


        button.addEventListener(
            "click",
            () => {

                const index =
                    favorites.indexOf(tool);


                if (index === -1) {

                    favorites.push(tool);

                    button.classList.add(
                        "active"
                    );

                    button.textContent =
                        "★";

                    showToast(
                        `${tool} added to favorites.`
                    );

                } else {

                    favorites.splice(
                        index,
                        1
                    );

                    button.classList.remove(
                        "active"
                    );

                    button.textContent =
                        "☆";

                    showToast(
                        `${tool} removed from favorites.`
                    );
                }


                localStorage.setItem(
                    STORAGE.favorites,
                    JSON.stringify(
                        favorites
                    )
                );


                updateStats();
            }
        );
    });
}


/* =========================================================
   SEARCH
========================================================= */

$("#toolSearch").addEventListener(
    "input",
    (event) => {

        const query =
            event.target.value
                .toLowerCase()
                .trim();


        $$(".tool-card").forEach(
            card => {

                const name =
                    card.dataset.tool
                        .toLowerCase();


                card.classList.toggle(
                    "hidden",
                    !name.includes(query)
                );
            }
        );
    }
);


document.addEventListener(
    "keydown",
    (event) => {

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            $("#toolSearch").focus();

            scrollToSection(
                "dashboard"
            );
        }


        if (event.key === "Escape") {
            closeModal();
        }
    }
);


/* =========================================================
   MOBILE MENU
========================================================= */

$("#menuBtn").addEventListener(
    "click",
    () => {

        $("#mainNav")
            .classList
            .toggle("open");
    }
);


/* =========================================================
   THEME
========================================================= */

function applyTheme() {

    const theme =
        localStorage.getItem(
            STORAGE.theme
        ) || "dark";


    document.body.classList.toggle(
        "light",
        theme === "light"
    );


    $("#themeBtn").textContent =
        theme === "light"
            ? "☀"
            : "☾";
}


$("#themeBtn").addEventListener(
    "click",
    () => {

        const light =
            document.body.classList.toggle(
                "light"
            );


        localStorage.setItem(
            STORAGE.theme,
            light
                ? "light"
                : "dark"
        );


        $("#themeBtn").textContent =
            light
                ? "☀"
                : "☾";
    }
);


/* =========================================================
   SYSTEM STATUS
========================================================= */

function updateSystemStatus() {

    $("#browserStatus").textContent =
        getBrowserName();


    $("#platformStatus").textContent =
        navigator.platform ||
        "Unknown";


    $("#cpuStatus").textContent =
        navigator.hardwareConcurrency
            ? `${navigator.hardwareConcurrency} threads`
            : "Unknown";


    $("#connectionStatus").textContent =
        navigator.onLine
            ? "ONLINE"
            : "OFFLINE";
}


function getBrowserName() {

    const ua =
        navigator.userAgent;


    if (ua.includes("Edg/")) {
        return "Microsoft Edge";
    }


    if (ua.includes("Chrome/")) {
        return "Google Chrome";
    }


    if (ua.includes("Firefox/")) {
        return "Mozilla Firefox";
    }


    if (ua.includes("Safari/")) {
        return "Safari";
    }


    return "Unknown Browser";
}


function updateClock() {

    $("#liveClock").textContent =
        new Date()
            .toLocaleTimeString();
}


window.addEventListener(
    "online",
    updateSystemStatus
);


window.addEventListener(
    "offline",
    updateSystemStatus
);


/* =========================================================
   TERMINAL
========================================================= */

function terminalPrint(
    text,
    className = ""
) {

    const output =
        $("#terminalOutput");


    const line =
        document.createElement("p");


    if (className) {
        line.className =
            className;
    }


    line.textContent =
        `> ${text}`;


    output.appendChild(line);


    output.scrollTop =
        output.scrollHeight;
}


function executeTerminalCommand(
    command
) {

    const cmd =
        command
            .trim()
            .toLowerCase();


    terminalPrint(command);


    if (!cmd) {
        return;
    }


    switch (cmd) {

        case "help":

            terminalPrint(
                "Commands: help, tools, system, cyber, lab, gaming, status, history, clear"
            );

            break;


        case "tools":

            terminalPrint(
                `${
                    document.querySelectorAll(
                        ".tool-card"
                    ).length
                } tools loaded.`
            );

            break;


        case "system":

            terminalPrint(
                `${
                    navigator.platform
                } // ${
                    navigator.hardwareConcurrency ||
                    "?"
                } CPU threads`
            );

            break;


        case "cyber":

            terminalPrint(
                "Cyber Lab online. Educational modules ready."
            );

            break;


        case "lab":

            terminalPrint(
                "Cyber Lab ready // safe simulations only."
            );

            openTool(
                "cyberLabTool"
            );

            break;


        case "gaming":

            terminalPrint(
                "Gaming Center online."
            );

            break;


        case "status":

            terminalPrint(
                navigator.onLine
                    ? "ALEE STATUS: ONLINE"
                    : "ALEE STATUS: OFFLINE"
            );

            break;


        case "history":

            terminalPrint(
                `${history.length} activity records stored locally.`
            );

            break;


        case "clear":

            $("#terminalOutput")
                .innerHTML = "";

            break;


        default:

            terminalPrint(
                `Unknown command: ${command}. Type "help".`
            );
    }
}


$("#terminalInput").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            executeTerminalCommand(
                event.target.value
            );

            event.target.value = "";
        }
    }
);


/* =========================================================
   SETTINGS
========================================================= */

$("#settingsBtn").addEventListener(
    "click",
    () => {

        openModal(`
            <div>

                <h2>⚙ ALEE Settings</h2>

                <p>
                    Manage local ALEE data.
                </p>

                <div class="tool-form">

                    <button
                        class="secondary-btn"
                        onclick="resetUsage()"
                    >
                        Reset Usage Counter
                    </button>


                    <button
                        class="secondary-btn"
                        onclick="resetFavorites()"
                    >
                        Reset Favorites
                    </button>


                    <button
                        class="secondary-btn"
                        onclick="clearHistory()"
                    >
                        Clear Activity History
                    </button>


                    <button
                        class="secondary-btn"
                        onclick="resetAllData()"
                    >
                        Reset All ALEE Data
                    </button>

                </div>

            </div>
        `);
    }
);


function resetUsage() {

    usage = 0;

    localStorage.removeItem(
        STORAGE.usage
    );

    updateStats();

    showToast(
        "Usage counter reset."
    );
}


function resetFavorites() {

    favorites = [];

    localStorage.removeItem(
        STORAGE.favorites
    );


    $$(".favorite").forEach(
        button => {

            button.classList.remove(
                "active"
            );

            button.textContent =
                "☆";
        }
    );


    updateStats();

    showToast(
        "Favorites reset."
    );
}


function resetAllData() {

    localStorage.removeItem(
        STORAGE.usage
    );

    localStorage.removeItem(
        STORAGE.favorites
    );

    localStorage.removeItem(
        STORAGE.history
    );

    localStorage.removeItem(
        STORAGE.notes
    );

    localStorage.removeItem(
        STORAGE.cyberXP
    );


    usage = 0;

    favorites = [];

    history = [];

    cyberLabState.score = 0;

    cyberLabState.challenge = null;

    cyberLabState.challengeSolved =
        false;


    $$(".favorite").forEach(
        button => {

            button.classList.remove(
                "active"
            );

            button.textContent =
                "☆";
        }
    );


    updateStats();


    showToast(
        "ALEE local data reset."
    );
}


/* =========================================================
   SAFE HTML HELPER
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeALEE() {

    applyTheme();

    setupFavorites();

    updateStats();

    updateSystemStatus();

    updateClock();


    setInterval(
        updateClock,
        1000
    );


    terminalPrint(
        "Cyber Ops modules initialized.",
        "terminal-green"
    );
}


initializeALEE();