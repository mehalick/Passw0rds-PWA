(function () {
    'use strict';

    var app = {
        isLoading: true,
        container: document.getElementById('container'),
        spinner: document.getElementById('loader'),
        passwords: document.getElementById('passwords'),
        copied: document.getElementById('copied'),
        refresh: document.getElementById('refresh'),
        lengths: [6, 8, 10, 12, 14, 16, 18, 20, 30, 40, 50, 60]
    };

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () { console.log('Service Worker Registered'); });
    }

    app.refresh.addEventListener('click', function (e) {
        app.loadPasswords();
        e.preventDefault();
    });

    app.getAlphaNumericPassword = function (length) {
        return app.getPassword(length, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
    }

    app.getSpecialCharPassword = function (length) {
        return app.getPassword(length, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!#$%&()*+,-.:;<>?@[]^_`{}~|');
    }

    app.getPassword = function (length, charset) {
        var i;
        var result = "";
        if (window.crypto && window.crypto.getRandomValues) {
            let values = new Uint32Array(length);
            window.crypto.getRandomValues(values);
            for (i = 0; i < length; i++) {
                result += charset[values[i] % charset.length];
            }
            return result;
        }
        else throw new Error("Your browser sucks and can't generate secure random numbers");
    }

    app.copyPassword = function () {
        this.select();
        document.execCommand('copy');
        app.copied.classList.remove('hidden');

        window.setTimeout(() => {
            app.copied.classList.add('hidden');

        }, 2000);
    }

    app.getInput = function (password) {
        var input = document.createElement('input');
        input.type = 'text';
        input.value = password;
        input.autocomplete = "off";
        input.autocorrect = "off";
        input.autocapitalize = "off";
        input.spellcheck = false;
        input.readOnly = true;
        input.addEventListener('click', app.copyPassword);
        return input;
    }

    app.loadPasswords = function () {

        while (app.passwords.firstChild) {
            app.passwords.firstChild.remove();
        }

        for (let i = 0; i < app.lengths.length; i++) {
            var row = document.createElement("tr");
            app.passwords.appendChild(row);

            var th = document.createElement("th");
            th.innerText = app.lengths[i];
            row.appendChild(th);

            if (app.lengths[i] < 30) {
                var td2 = document.createElement("td");
                td2.appendChild(app.getInput(app.getAlphaNumericPassword(app.lengths[i])));
                row.appendChild(td2);

                var td3 = document.createElement("td");
                td3.appendChild(app.getInput(app.getSpecialCharPassword(app.lengths[i])));
                row.appendChild(td3);
            }
            else {
                var td = document.createElement("td");
                td.colSpan = 2;
                
                var input = app.getInput(app.getAlphaNumericPassword(app.lengths[i]));
                input.classList.add('small');
                
                td.appendChild(input);
                row.appendChild(td);
            }
        }

        if (app.isLoading) {
            app.spinner.setAttribute('hidden', true);
            app.container.removeAttribute('hidden');
            app.isLoading = false;
        }
    };

    app.loadPasswords();

})();