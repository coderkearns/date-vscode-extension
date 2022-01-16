const vscode = require('vscode');

// Adds 5 commands: date.paste, date.paste.iso, date.paste.locale, date.paste.gmt

const commands = {
    "date.paste": date,
    "date.paste.iso": dateISO,
    "date.paste.locale": dateLocale,
    "date.paste.gmt": dateGMT
};


function activate(context) {
    for (let command in commands) {
        context.subscriptions.push(vscode.commands.registerCommand(command, () => pasteIntoEditor(commands[command]())));
    }
}

function deactivate() { }

function pasteIntoEditor(text) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    editor.edit(editBuilder => {
        editBuilder.insert(editor.selection.active, text);
    });
}

function today() { return new Date() }

// Default Format: monthName day, year
function date() {
    const now = today();
    return `${now.toLocaleString('default', { month: 'long' })} ${now.getDate()}, ${now.getFullYear()}`;
}

// ISO Format: YYYY-MM-DD
function dateISO() {
    const now = today();
    const year = now.getFullYear();
    const monthNumber = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}-${day < 10 ? '0' + day : day}`;
}

// Locale Format: monthNumber/day/year, hour:minute:second [AM/PM])
function dateLocale() {
    const now = today();
    return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleString('default', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}`;
}

// GMT Format: weekday, day month year hour:minute:second GMT
function dateGMT() {
    const now = today();
    return `${now.toLocaleString('en-US', { weekday: 'long' })}, ${now.getDate()} ${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()} ${now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })} GMT`;
}

module.exports = { activate, deactivate };