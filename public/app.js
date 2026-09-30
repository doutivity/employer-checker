(function () {
    'use strict';

    const GOOGLE_ICON =
        '<svg class="g-icon" viewBox="0 0 48 48" aria-hidden="true">' +
        '<path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/>' +
        '<path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/>' +
        '<path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-2.9-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/>' +
        '<path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/>' +
        '</svg>';

    const $form = document.getElementById('search-form');
    const $query = document.getElementById('query');
    const $results = document.getElementById('results');
    const $groups = document.getElementById('groups');
    const $copy = document.getElementById('copy-link');
    const $status = document.getElementById('status');

    function searchUrl(site, query) {
        return 'https://www.google.com/search?q=' + encodeURIComponent('site:' + site + ' ' + query);
    }

    function setUrlQuery(query) {
        const url = new URL(window.location.href);
        if (query) {
            url.searchParams.set('q', query);
        } else {
            url.searchParams.delete('q');
        }
        window.history.replaceState(null, '', url);
    }

    function renderGroup(group, query) {
        const section = document.createElement('section');
        section.className = 'group';

        const header = document.createElement('div');
        header.className = 'group-header';

        const title = document.createElement('h3');
        title.textContent = group.title;

        const openAll = document.createElement('button');
        openAll.type = 'button';
        openAll.className = 'btn-link';
        openAll.textContent = 'Open all';
        openAll.title = 'Opens every link in a new tab. Allow pop-ups for this site if only one opens.';
        openAll.addEventListener('click', function () {
            group.sources.forEach(function (source) {
                window.open(searchUrl(source.site, query), '_blank', 'noopener');
            });
        });

        header.append(title, openAll);

        const list = document.createElement('ul');
        group.sources.forEach(function (source) {
            const item = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.href = searchUrl(source.site, query);
            anchor.target = '_blank';
            anchor.rel = 'noopener';
            anchor.innerHTML = GOOGLE_ICON;
            anchor.append(document.createTextNode(source.name));
            item.append(anchor);
            list.append(item);
        });

        section.append(header, list);
        return section;
    }

    function generateLinks() {
        const query = $query.value.trim();
        $groups.replaceChildren();
        setUrlQuery(query);

        if (!query) {
            $results.hidden = true;
            $status.textContent = '';
            return;
        }

        window.SOURCE_GROUPS.forEach(function (group) {
            $groups.append(renderGroup(group, query));
        });
        $results.hidden = false;

        const total = window.SOURCE_GROUPS.reduce(function (n, g) { return n + g.sources.length; }, 0);
        $status.textContent = total + ' search links for “' + query + '”';
    }

    $form.addEventListener('submit', function (event) {
        event.preventDefault();
        generateLinks();
    });

    $query.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            generateLinks();
        }
    });

    $copy.addEventListener('click', function () {
        const done = function () {
            $copy.textContent = 'Copied!';
            setTimeout(function () { $copy.textContent = 'Copy link'; }, 1500);
        };
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).then(done, function () {
                window.prompt('Copy this link:', window.location.href);
            });
        } else {
            window.prompt('Copy this link:', window.location.href);
        }
    });

    // URLSearchParams already decodes values, so no extra decodeURIComponent.
    const initial = new URLSearchParams(window.location.search).get('q');
    if (initial) {
        $query.value = initial;
        generateLinks();
    }
})();
