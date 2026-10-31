const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const planFinder = document.querySelector('#plan-finder-form');
if (planFinder) {
  const result = document.querySelector('#finder-result');
  const resultTitle = document.querySelector('#finder-result-title');
  const resultCopy = document.querySelector('#finder-result-copy');
  const workoutList = document.querySelector('#finder-workouts');

  const routines = {
    strength: {
      2: ['Day 1 · Full body: squat or leg press, chest press, seated row, and core.', 'Day 2 · Full body: hip hinge, shoulder press, pulldown, and core.'],
      3: ['Day 1 · Full body A: squat or leg press, chest press, and seated row.', 'Day 2 · Full body B: hip hinge, shoulder press, and pulldown.', 'Day 3 · Repeat A and B on alternate weeks.'],
      4: ['Day 1 · Upper body A: chest press, row, shoulder press.', 'Day 2 · Lower body A: squat or leg press, hip hinge, core.', 'Day 3 · Upper body B: pulldown, incline press, row.', 'Day 4 · Lower body B: split squat, hamstring curl, core.'],
    },
    cardio: {
      2: ['Day 1 · Full-body strength: squat or leg press, chest press, row, and core.', 'Day 2 · Full-body strength plus 15–20 minutes of easy cycling or walking.'],
      3: ['Day 1 · Full-body strength A.', 'Day 2 · 20–25 minutes of comfortable cardio, then mobility.', 'Day 3 · Full-body strength B.'],
      4: ['Day 1 · Full-body strength A.', 'Day 2 · 20–25 minutes of comfortable cardio.', 'Day 3 · Full-body strength B.', 'Day 4 · Easy cardio and mobility.'],
    },
    fitness: {
      2: ['Day 1 · Full-body strength: squat or leg press, push, pull, and core.', 'Day 2 · Full-body strength plus 10–15 minutes of comfortable cardio.'],
      3: ['Day 1 · Full-body strength A.', 'Day 2 · Comfortable cardio and mobility.', 'Day 3 · Full-body strength B.'],
      4: ['Day 1 · Full-body strength A.', 'Day 2 · Comfortable cardio and mobility.', 'Day 3 · Full-body strength B.', 'Day 4 · Easy cardio or a brisk walk.'],
    },
  };

  planFinder.addEventListener('submit', (event) => {
    event.preventDefault();
    const goal = document.querySelector('#finder-goal').value;
    const experience = document.querySelector('#finder-experience').value;
    const days = document.querySelector('#finder-days').value;
    const height = document.querySelector('#finder-height').value;
    const weight = document.querySelector('#finder-weight').value;
    const goalNames = { strength: 'Strength builder', cardio: 'Cardio + strength', fitness: 'General fitness' };
    const effortTip = experience === 'beginner'
      ? 'Start with 2 comfortable sets of 8–10 reps per strength exercise and build up gradually.'
      : 'Start with 2–3 controlled sets of 8–12 reps per strength exercise; keep the effort manageable.';

    resultTitle.textContent = `${goalNames[goal]} · ${days} days per week`;
    resultCopy.textContent = `Starter routine for ${height} cm and ${weight} kg. ${effortTip}`;
    workoutList.replaceChildren(...routines[goal][days].map((workout) => {
      const item = document.createElement('li');
      item.textContent = workout;
      return item;
    }));
    result.hidden = false;
  });
}

const productGrid = document.querySelector('.products-grid');
if (productGrid) {
  const productCards = [...productGrid.querySelectorAll('.product-card')];
  const search = document.querySelector('#product-search');
  const typeFilter = document.querySelector('#product-type-filter');
  const flavorFilter = document.querySelector('#product-flavor-filter');
  const sizeFilter = document.querySelector('#product-size-filter');
  const resetButton = document.querySelector('#product-filter-reset');
  const count = document.querySelector('#product-result-count');
  const noResults = document.querySelector('#product-no-results');
  const orderItems = document.querySelector('#order-items');
  const cartCount = document.querySelector('#cart-count');
  const cartTotal = document.querySelector('#cart-total');
  const cartEmpty = document.querySelector('#cart-empty');
  const clearCartButton = document.querySelector('#clear-cart');
  const checkoutButton = document.querySelector('#checkout-button');
  const checkoutNote = document.querySelector('#checkout-note');
  const floatingCartLink = document.querySelector('#floating-cart-link');
  const floatingCartCount = document.querySelector('#floating-cart-count');
  const gymWhatsAppNumber = '919739269922';
  const cartStorageKey = 'spark-order-cart';
  const readCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
      return Array.isArray(cart) ? cart : [];
    } catch {
      return [];
    }
  };
  const saveCart = (cart) => {
    try { localStorage.setItem(cartStorageKey, JSON.stringify(cart)); } catch { /* Cart still works for this visit. */ }
  };
  let cart = readCart();

  const renderCart = () => {
    const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = `${quantity} ${quantity === 1 ? 'ITEM' : 'ITEMS'}`;
    floatingCartCount.textContent = String(quantity);
    floatingCartLink.hidden = quantity === 0;
    cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
    cartEmpty.hidden = cart.length > 0;
    clearCartButton.hidden = cart.length === 0;
    checkoutButton.disabled = cart.length === 0;
    orderItems.replaceChildren(...cart.map((item) => {
      const row = document.createElement('li');
      row.className = 'order-item';
      const details = document.createElement('div');
      details.className = 'order-item-details';
      const title = document.createElement('strong');
      title.textContent = item.name;
      const variant = document.createElement('span');
      variant.textContent = `${item.size} · ${item.flavor} · Qty ${item.quantity}`;
      details.append(title, variant);
      const amount = document.createElement('strong');
      amount.className = 'order-item-price';
      amount.textContent = `₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-order-item';
      remove.textContent = 'REMOVE ITEM';
      remove.setAttribute('aria-label', `Remove ${item.name} from order`);
      remove.addEventListener('click', () => {
        cart = cart.filter((entry) => entry.key !== item.key);
        saveCart(cart);
        renderCart();
      });
      row.append(details, amount, remove);
      return row;
    }));
  };

  productCards.forEach((card) => {
    const flavors = card.dataset.flavours.split(' ').map((value) => value.replaceAll('-', ' '));
    let flavorSelect = null;
    if (flavors.length > 1) {
      const label = document.createElement('label');
      label.className = 'order-flavor-picker';
      label.textContent = 'CHOOSE FLAVOR';
      flavorSelect = document.createElement('select');
      flavorSelect.setAttribute('aria-label', `Choose flavor for ${card.querySelector('h3').textContent}`);
      flavors.forEach((flavor) => {
        const option = document.createElement('option');
        option.value = flavor;
        option.textContent = flavor.replace(/\b\w/g, (letter) => letter.toUpperCase());
        flavorSelect.append(option);
      });
      label.append(flavorSelect);
      card.querySelector('.product-sizes').before(label);
    }
    const sizeRows = [...card.querySelectorAll('.product-sizes p')];
    const sizeLabel = document.createElement('label');
    sizeLabel.className = 'order-size-picker';
    sizeLabel.textContent = 'PACK SIZE';
    const sizeSelect = document.createElement('select');
    sizeSelect.setAttribute('aria-label', `Choose pack size for ${card.querySelector('h3').textContent}`);
    sizeRows.forEach((sizeRow) => {
      const size = sizeRow.querySelector('span').textContent.trim();
      const price = Number(sizeRow.querySelector('strong').textContent.replace(/[^\d]/g, ''));
      const option = document.createElement('option');
      option.value = String(sizeRows.indexOf(sizeRow));
      option.textContent = `${size} — ₹${price.toLocaleString('en-IN')}`;
      option.dataset.size = size;
      option.dataset.price = String(price);
      sizeSelect.append(option);
    });
    sizeLabel.append(sizeSelect);
    card.querySelector('.product-sizes').replaceWith(sizeLabel);

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'add-to-order';
    addButton.textContent = 'ADD TO CART +';
    addButton.addEventListener('click', () => {
      const selectedSize = sizeSelect.selectedOptions[0];
      const size = selectedSize.dataset.size;
      const price = Number(selectedSize.dataset.price);
      const flavor = flavorSelect ? flavorSelect.value : flavors[0];
      const name = card.querySelector('h3').textContent.trim();
      const key = `${name}|${size}|${flavor}`;
      const existing = cart.find((item) => item.key === key);
      if (existing) existing.quantity += 1;
      else cart.push({ key, name, size, flavor, price, quantity: 1 });
      saveCart(cart);
      renderCart();
      addButton.textContent = 'ADDED ✓';
      window.setTimeout(() => { addButton.textContent = 'ADD TO CART +'; }, 1200);
    });
    sizeLabel.after(addButton);
  });

  clearCartButton.addEventListener('click', () => {
    cart = [];
    saveCart(cart);
    renderCart();
  });

  checkoutButton.addEventListener('click', () => {
    if (!cart.length) return;
    if (!/^\d{10,15}$/.test(gymWhatsAppNumber)) {
      checkoutNote.textContent = 'Add Spark Fitness’s WhatsApp number to the website to activate order sending.';
      checkoutNote.classList.add('checkout-note-alert');
      return;
    }
    const lines = cart.map((item) => `• ${item.name} — ${item.size}, ${item.flavor}, qty ${item.quantity}: ₹${(item.price * item.quantity).toLocaleString('en-IN')}`);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const message = `Hi Spark Fitness! I would like to order:\n${lines.join('\n')}\n\nEstimated total: ₹${total.toLocaleString('en-IN')}`;
    window.open(`https://wa.me/${gymWhatsAppNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  const updateProducts = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    productCards.forEach((card) => {
      const matchesSearch = `${card.querySelector('h3').textContent} ${card.querySelector('.product-detail').textContent} ${card.querySelector('.product-flavor').textContent}`.toLocaleLowerCase().includes(query);
      const matchesType = !typeFilter.value || card.dataset.type === typeFilter.value;
      const matchesFlavor = !flavorFilter.value || card.dataset.flavours.split(' ').includes(flavorFilter.value);
      const matchesSize = !sizeFilter.value || card.dataset.sizes.split(' ').includes(sizeFilter.value);
      const isVisible = matchesSearch && matchesType && matchesFlavor && matchesSize;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    count.textContent = `${visibleCount} ${visibleCount === 1 ? 'product' : 'products'}`;
    noResults.hidden = visibleCount !== 0;
  };

  [search, typeFilter, flavorFilter, sizeFilter].forEach((control) => {
    control.addEventListener(control === search ? 'input' : 'change', updateProducts);
  });

  resetButton.addEventListener('click', () => {
    search.value = '';
    typeFilter.value = '';
    flavorFilter.value = '';
    sizeFilter.value = '';
    updateProducts();
    search.focus();
  });

  updateProducts();
  renderCart();
}

const safeRead = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep the interaction usable when browser storage is unavailable.
  }
};

const challengeInputs = [...document.querySelectorAll('[data-challenge-day]')];
if (challengeInputs.length) {
  const savedDays = safeRead('spark-challenge-days', []);
  const progress = document.querySelector('#challenge-progress');
  const progressLabel = document.querySelector('#challenge-progress-label');

  challengeInputs.forEach((input) => {
    input.checked = savedDays.includes(Number(input.dataset.challengeDay));
  });

  const updateChallenge = () => {
    const completedDays = challengeInputs
      .filter((input) => input.checked)
      .map((input) => Number(input.dataset.challengeDay));
    progress.value = completedDays.length;
    progressLabel.textContent = `${completedDays.length} / 7 complete`;
    safeWrite('spark-challenge-days', completedDays);
    updateMilestones();
  };

  challengeInputs.forEach((input) => input.addEventListener('change', updateChallenge));
  updateChallenge();
}

const logVisitButton = document.querySelector('#log-visit');
if (logVisitButton) {
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const visitDates = new Set(safeRead('spark-visit-dates', []).filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)));
  const today = new Date();
  const todayKey = formatDateKey(today);
  const week = document.querySelector('#visit-week');
  const visitTotal = document.querySelector('#visit-total');
  const streakCount = document.querySelector('#visit-streak-count');

  const renderVisitHistory = () => {
    week.replaceChildren();
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
      const key = formatDateKey(date);
      const cell = document.createElement('div');
      cell.className = `visit-day${visitDates.has(key) ? ' is-logged' : ''}${key === todayKey ? ' is-today' : ''}`;
      cell.setAttribute('aria-label', `${date.toLocaleDateString('en', { weekday: 'long' })}${visitDates.has(key) ? ', visit logged' : ''}`);

      const weekday = document.createElement('span');
      weekday.textContent = date.toLocaleDateString('en', { weekday: 'short' });
      const dayNumber = document.createElement('strong');
      dayNumber.textContent = String(date.getDate());
      const mark = document.createElement('i');
      mark.textContent = visitDates.has(key) ? '✓' : '·';
      cell.append(weekday, dayNumber, mark);
      week.append(cell);
    }

    let streak = 0;
    const streakCursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!visitDates.has(todayKey)) streakCursor.setDate(streakCursor.getDate() - 1);
    while (visitDates.has(formatDateKey(streakCursor))) {
      streak += 1;
      streakCursor.setDate(streakCursor.getDate() - 1);
    }

    streakCount.textContent = String(streak);
    visitTotal.textContent = `${visitDates.size} ${visitDates.size === 1 ? 'visit' : 'visits'} logged`;
    logVisitButton.disabled = visitDates.has(todayKey);
    logVisitButton.innerHTML = visitDates.has(todayKey) ? 'VISIT LOGGED TODAY <span>✓</span>' : 'LOG TODAY’S VISIT <span>↗</span>';
    updateMilestones();
  };

  logVisitButton.addEventListener('click', () => {
    visitDates.add(todayKey);
    safeWrite('spark-visit-dates', [...visitDates].sort());
    renderVisitHistory();
  });

  renderVisitHistory();
}

function updateMilestones() {
  const milestoneGrid = document.querySelector('#milestone-grid');
  if (!milestoneGrid) return;

  const visits = safeRead('spark-visit-dates', []).length;
  const completedChallenge = safeRead('spark-challenge-days', []).length === 7;
  let unlocked = 0;

  milestoneGrid.querySelectorAll('.milestone').forEach((badge) => {
    const achieved = badge.dataset.visits
      ? visits >= Number(badge.dataset.visits)
      : completedChallenge;
    badge.classList.toggle('is-unlocked', achieved);
    badge.setAttribute('aria-label', `${badge.querySelector('strong').textContent}: ${achieved ? 'unlocked' : 'not yet unlocked'}`);
    if (achieved) unlocked += 1;
  });

  const message = document.querySelector('#milestone-message');
  message.textContent = unlocked
    ? `${unlocked} of 4 milestones unlocked — keep your momentum going!`
    : 'Your first check-in is waiting.';
}

const timerStart = document.querySelector('#timer-start');
if (timerStart) {
  const moves = [
    'Chair squats or comfortable sit-to-stands',
    'Wall push-ups',
    'March in place at an easy pace',
  ];
  const workSeconds = 30;
  const restSeconds = 15;
  const timerDisplay = document.querySelector('#workout-timer');
  const phaseDisplay = document.querySelector('#workout-phase');
  const moveDisplay = document.querySelector('#workout-move');
  const timerProgress = document.querySelector('#timer-progress');
  const resetButton = document.querySelector('#timer-reset');
  let moveIndex = 0;
  let isRest = false;
  let secondsLeft = workSeconds;
  let timerId = null;
  let isComplete = false;

  const renderTimer = () => {
    timerDisplay.textContent = `00:${String(secondsLeft).padStart(2, '0')}`;
    phaseDisplay.textContent = isRest ? 'REST' : `MOVE ${moveIndex + 1} OF ${moves.length}`;
    moveDisplay.textContent = isRest ? 'Rest and breathe' : moves[moveIndex];
    timerProgress.style.width = `${((isRest ? secondsLeft / restSeconds : secondsLeft / workSeconds) * 100)}%`;
  };

  const finishTimer = () => {
    window.clearInterval(timerId);
    timerId = null;
    isComplete = true;
    secondsLeft = 0;
    timerDisplay.textContent = '00:00';
    phaseDisplay.textContent = 'DONE';
    moveDisplay.textContent = 'Nice work. Ask a trainer for another variation.';
    timerProgress.style.width = '0%';
    timerStart.disabled = true;
    timerStart.textContent = 'COMPLETE';
  };

  timerStart.addEventListener('click', () => {
    if (isComplete) return;
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
      timerStart.textContent = 'RESUME';
      return;
    }

    timerStart.textContent = 'PAUSE';
    timerId = window.setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        if (isRest) {
          moveIndex += 1;
          isRest = false;
          if (moveIndex >= moves.length) {
            finishTimer();
            return;
          }
          secondsLeft = workSeconds;
        } else if (moveIndex < moves.length - 1) {
          isRest = true;
          secondsLeft = restSeconds;
        } else {
          finishTimer();
          return;
        }
      }
      renderTimer();
    }, 1000);
  });

  resetButton.addEventListener('click', () => {
    window.clearInterval(timerId);
    timerId = null;
    moveIndex = 0;
    isRest = false;
    secondsLeft = workSeconds;
    isComplete = false;
    timerStart.disabled = false;
    timerStart.textContent = 'START';
    renderTimer();
  });

  renderTimer();
}

const clubGrid = document.querySelector('.club-grid');
if (clubGrid) {
  const voteButtons = [...clubGrid.querySelectorAll('[data-vote]')];
  const voteMessage = document.querySelector('#club-vote-message');
  const teamButtons = [...clubGrid.querySelectorAll('[data-team]')];
  const teamMessage = document.querySelector('#team-message');
  const passportButtons = [...clubGrid.querySelectorAll('[data-passport]')];
  const voteNames = {
    'coach-circuit': 'Coach’s circuit',
    'cardio-groove': 'Cardio groove',
    'strength-challenge': 'Strength challenge',
  };
  const teamNames = { 'team-spark': 'Team Spark', 'team-pulse': 'Team Pulse' };
  const weekStartKey = (date = new Date()) => {
    const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    const year = monday.getFullYear();
    const month = String(monday.getMonth() + 1).padStart(2, '0');
    const day = String(monday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const currentWeek = weekStartKey();
  const voteStorageKey = `spark-club-vote-${currentWeek}`;
  const selectedVote = safeRead(voteStorageKey, '');

  const updateBadgeCount = () => {
    const visits = safeRead('spark-visit-dates', []).length;
    const challengeDays = safeRead('spark-challenge-days', []);
    const stamps = safeRead('spark-passport-stamps', []);
    const questComplete = safeRead(`spark-quest-${currentWeek}`, false);
    const visitBadges = [1, 5, 10].filter((threshold) => visits >= threshold).length;
    const challengeBadge = challengeDays.length >= 7 ? 1 : 0;
    const voteBadge = voteNames[safeRead(voteStorageKey, '')] ? 1 : 0;
    const visitorBadges = voteBadge + challengeBadge + (questComplete ? 1 : 0);
    const memberBadges = visitBadges + stamps.length;
    document.querySelector('#visitor-badge-count').textContent = String(visitorBadges);
    document.querySelector('#member-badge-count').textContent = String(memberBadges);
    document.querySelector('#my-badge-count').textContent = String(visitorBadges + memberBadges);
  };

  voteButtons.forEach((button) => {
    const isSelected = button.dataset.vote === selectedVote;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
    button.addEventListener('click', () => {
      safeWrite(voteStorageKey, button.dataset.vote);
      voteButtons.forEach((option) => {
        const selected = option === button;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      voteMessage.textContent = `Your pick this week: ${voteNames[button.dataset.vote]}. This vote is saved on this device.`;
      updateBadgeCount();
    });
  });
  if (selectedVote && voteNames[selectedVote]) {
    voteMessage.textContent = `Your pick this week: ${voteNames[selectedVote]}. This vote is saved on this device.`;
  }

  const selectedTeam = safeRead('spark-club-team', '');
  teamButtons.forEach((button) => {
    const isSelected = button.dataset.team === selectedTeam;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
    button.addEventListener('click', () => {
      safeWrite('spark-club-team', button.dataset.team);
      teamButtons.forEach((option) => {
        const selected = option === button;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
      });
      teamMessage.textContent = `You joined ${teamNames[button.dataset.team]}. Shared team totals need member accounts.`;
    });
  });
  if (selectedTeam && teamNames[selectedTeam]) {
    teamMessage.textContent = `You’re on ${teamNames[selectedTeam]}. Shared team totals need member accounts.`;
  }

  const savedStamps = new Set(safeRead('spark-passport-stamps', []));
  const passportCount = document.querySelector('#passport-count');
  const renderPassport = () => {
    passportButtons.forEach((button) => {
      const collected = savedStamps.has(button.dataset.passport);
      button.classList.toggle('is-collected', collected);
      button.setAttribute('aria-pressed', String(collected));
      button.setAttribute('aria-label', `${button.querySelector('strong').textContent}: ${collected ? 'stamp collected' : 'collect stamp'}`);
    });
    passportCount.textContent = `${savedStamps.size} of ${passportButtons.length} stamps collected`;
    safeWrite('spark-passport-stamps', [...savedStamps]);
    updateBadgeCount();
  };
  passportButtons.forEach((button) => button.addEventListener('click', () => {
    savedStamps.add(button.dataset.passport);
    renderPassport();
  }));
  renderPassport();

  const winForm = document.querySelector('#win-form');
  const winList = document.querySelector('#win-list');
  const renderWins = () => {
    const wins = safeRead('spark-member-wins', []).slice(-5).reverse();
    winList.replaceChildren();
    wins.forEach((win) => {
      const item = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = `${win.name}: `;
      item.append(name, document.createTextNode(win.text));
      winList.append(item);
    });
  };
  winForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#win-name').value.trim();
    const text = document.querySelector('#win-text').value.trim();
    if (!name || !text) return;
    const wins = safeRead('spark-member-wins', []);
    wins.push({ name, text, createdAt: new Date().toISOString() });
    safeWrite('spark-member-wins', wins.slice(-20));
    winForm.reset();
    renderWins();
  });
  renderWins();

  const nextGoalForm = document.querySelector('#next-goal-form');
  const nextGoalSelect = document.querySelector('#next-goal');
  const goalResult = document.querySelector('#goal-result');
  const goalSuggestions = {
    strength: 'This week: ask a trainer to teach you one strength movement, then practice it during your next visit.',
    cardio: 'This week: choose a comfortable cardio activity and try it during two visits.',
    consistency: 'This week: pick two days that fit your schedule and plan your visits ahead.',
    coach: 'This week: book a trainer check-in and bring one question about your routine.',
  };
  const savedGoal = safeRead('spark-next-goal', '');
  if (savedGoal && goalSuggestions[savedGoal]) {
    nextGoalSelect.value = savedGoal;
    goalResult.textContent = goalSuggestions[savedGoal];
  }
  nextGoalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    safeWrite('spark-next-goal', nextGoalSelect.value);
    goalResult.textContent = goalSuggestions[nextGoalSelect.value];
  });

  const quests = [
    { title: 'LEARN ONE NEW MOVE', copy: 'Ask a trainer to show you a movement or machine you haven’t tried before.' },
    { title: 'PICK YOUR FAVORITE FINISHER', copy: 'End one workout with a comfortable walk, stretch, or cooldown you enjoy.' },
    { title: 'BRING A TRAINING BUDDY', copy: 'Invite a friend to visit Spark with you and introduce them to the team.' },
    { title: 'TRY A DIFFERENT ROUTE', copy: 'Choose a new cardio machine or strength station and ask for a quick demo.' },
  ];
  const weekNumber = Math.floor(new Date(`${currentWeek}T00:00:00`).getTime() / (7 * 24 * 60 * 60 * 1000));
  const quest = quests[((weekNumber % quests.length) + quests.length) % quests.length];
  const questTitle = document.querySelector('#quest-title');
  const questCopy = document.querySelector('#quest-copy');
  const questButton = document.querySelector('#quest-complete');
  const questMessage = document.querySelector('#quest-message');
  const questKey = `spark-quest-${currentWeek}`;
  const questDone = safeRead(questKey, false);
  questTitle.textContent = quest.title;
  questCopy.textContent = quest.copy;
  if (questDone) {
    questButton.disabled = true;
    questButton.textContent = 'QUEST COMPLETE ✓';
    questMessage.textContent = 'Quest badge earned for this week!';
  }
  questButton.addEventListener('click', () => {
    safeWrite(questKey, true);
    questButton.disabled = true;
    questButton.textContent = 'QUEST COMPLETE ✓';
    questMessage.textContent = 'Quest badge earned for this week!';
    updateBadgeCount();
  });

  updateBadgeCount();
}

const memberLoginForm = document.querySelector('#member-login-form');
if (memberLoginForm) {
  const passwordInput = document.querySelector('#member-password');
  const passwordToggle = document.querySelector('#password-toggle');
  const loginStatus = document.querySelector('#login-status');

  passwordToggle.addEventListener('click', () => {
    const showPassword = passwordInput.type === 'password';
    passwordInput.type = showPassword ? 'text' : 'password';
    passwordToggle.textContent = showPassword ? 'HIDE' : 'SHOW';
    passwordToggle.setAttribute('aria-label', showPassword ? 'Hide password' : 'Show password');
    passwordToggle.setAttribute('aria-pressed', String(showPassword));
  });

  memberLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loginStatus.textContent = 'Online member sign-in is not connected yet. Your email and password were not saved or sent.';
    loginStatus.hidden = false;
    passwordInput.value = '';
  });
}

const memberRegisterForm = document.querySelector('#member-register-form');
if (memberRegisterForm) {
  const password = document.querySelector('#register-password');
  const confirmPassword = document.querySelector('#register-confirm-password');
  const registerStatus = document.querySelector('#register-status');

  memberRegisterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!memberRegisterForm.checkValidity()) {
      memberRegisterForm.reportValidity();
      return;
    }

    if (password.value !== confirmPassword.value) {
      registerStatus.textContent = 'Those passwords don’t match. Please check them and try again.';
      registerStatus.hidden = false;
      confirmPassword.focus();
      return;
    }

    registerStatus.textContent = 'Online registration is not connected yet. Your details were not saved or sent.';
    registerStatus.hidden = false;
    password.value = '';
    confirmPassword.value = '';
  });
}
