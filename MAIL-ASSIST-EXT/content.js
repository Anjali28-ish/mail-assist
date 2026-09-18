console.log("Mail Assist");


// ===============================
// Get Email Content
// ===============================

function getEmailContent() {

    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const selector of selectors) {

        const content = document.querySelector(selector);

        if (content) {
            return content.innerText.trim();
        }
    }

    return '';
}


// ===============================
// Find Gmail Compose Toolbar
// ===============================

function findComposeToolbar() {

    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for (const selector of selectors) {

        const toolbar = document.querySelector(selector);

        if (toolbar) {
            return toolbar;
        }
    }

    return null;
}


// ===============================
// Create AI Reply Button
// ===============================

function createAIButton() {

    const button = document.createElement('div');

    button.className =
        'T-I J-J5-Ji hG T-I-atl L3 ai-reply-button';

    button.innerText = 'AI Reply';

    button.setAttribute('role', 'button');
    button.setAttribute(
        'data-tooltip',
        'Generate AI Reply'
    );

    button.setAttribute(
        'aria-label',
        'Generate AI Reply'
    );


    // ===============================
    // Button Click
    // ===============================

    button.addEventListener('click', async () => {

        try {

            // Show loading state
            button.innerHTML = 'Generating...';

            button.style.pointerEvents = 'none';


            // Get email content
            const emailContent = getEmailContent();

            console.log(
                "Email Content:",
                emailContent
            );


            // ===============================
            // Call Spring Boot Backend
            // ===============================

            const response = await fetch(
                'http://localhost:8080/api/email/generate',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        emailContent: emailContent,
                        tone: 'professional'
                    })
                }
            );


            // ===============================
            // Check API Response
            // ===============================

            if (!response.ok) {

                throw new Error(
                    `API Request Failed: ${response.status}`
                );
            }


            // ===============================
            // Get Generated Reply
            // ===============================

            const generatedReply =
                await response.text();

            console.log(
                "Generated Reply:",
                generatedReply
            );


            // ===============================
            // Find Gmail Compose Box
            // ===============================

            const composeBox =
                document.querySelector(
                    '[role="textbox"][g_editable="true"]'
                );


            if (composeBox) {

                composeBox.focus();

                document.execCommand(
                    'insertText',
                    false,
                    generatedReply
                );

            } else {

                console.error(
                    "Compose box not found"
                );
            }


        } catch (error) {

            console.error(
                "AI Reply Error:",
                error
            );

        } finally {

            // Restore button
            button.innerHTML = 'AI Reply';

            button.style.pointerEvents = 'auto';
        }
    });


    return button;
}


// ===============================
// Inject AI Button
// ===============================

function injectButton() {

    const toolbar = findComposeToolbar();


    if (!toolbar) {

        console.log(
            "Toolbar not found"
        );

        return;
    }


    console.log(
        "Toolbar found"
    );


    // Prevent duplicate button
    if (
        toolbar.querySelector(
            '.ai-reply-button'
        )
    ) {

        console.log(
            "AI Reply button already exists"
        );

        return;
    }


    // Create button
    const button = createAIButton();


    // Add button to toolbar
    toolbar.insertBefore(
        button,
        toolbar.firstChild
    );


    console.log(
        "AI Reply button added"
    );
}


// ===============================
// Gmail DOM Observer
// ===============================

const observer =
    new MutationObserver((mutations) => {

        for (const mutation of mutations) {

            const addedNodes =
                Array.from(
                    mutation.addedNodes
                );


            const hasComposeElements =
                addedNodes.some(node => {

                    if (
                        node.nodeType !==
                        Node.ELEMENT_NODE
                    ) {
                        return false;
                    }


                    return (
                        node.matches(
                            '.aDh, .btC, [role="dialog"]'
                        ) ||

                        node.querySelector(
                            '.aDh, .btC, [role="dialog"]'
                        )
                    );
                });


            if (hasComposeElements) {

                console.log(
                    "Compose Window Detected."
                );


                setTimeout(
                    injectButton,
                    500
                );
            }
        }
    });


// ===============================
// Start Observer
// ===============================

observer.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);