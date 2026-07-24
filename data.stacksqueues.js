// ============================================================
// DSA Stacks & Queues — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["stacksqueues"] so
// multiple topic files can coexist without clashing on names.
// ============================================================
(function () {

const TOPIC = {
  id: "stacksqueues",
  title: "Stacks & Queues",
  tagline: "Last-in-first-out, first-in-first-out — two simple rules that quietly power a huge chunk of interview questions."
};

const PATTERNS = [
  {
    id: "stack-fundamentals",
    name: "Stack & Queue Fundamentals",
    color: "#6fcf97",
    icon: "stack-fundamentals",
    trigger: "Building a stack or queue yourself, or building one out of the other",
    summary: "Before the clever problems, get comfortable with how these two structures actually work under the hood — including the classic trick of building one using only the other.",
    problems: [
      {
        name: "Implement a Stack using Arrays",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/implement-stack-using-array/",
        idea: "A stack only ever needs to touch one end — the 'top'. An array already gives you push/pop at the end for free (`push()` and `pop()`), so a stack is really just an array used with one rule: only ever add or remove from the end.",
        time: "O(1) for push/pop/top", space: "O(n)",
        code: `class Stack {
  constructor() { this.items = []; }
  push(x) { this.items.push(x); }
  pop() { return this.items.pop(); }
  top() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}`,
        variations: [],
        gotchas: ["Always check `isEmpty()` before calling pop/top — popping from nothing should be handled deliberately, not crash."]
      },
      {
        name: "Implement a Queue using Arrays",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/implement-queue-using-array/",
        idea: "A queue needs to add at one end and remove from the other — first in, first out. With a plain array, removing from the front (`shift()`) is slow because everything else has to shift down. A common fix is to just track a separate 'front' index and move it forward instead of actually deleting elements, so nothing needs to shift.",
        time: "O(1) for enqueue/dequeue (with the front-index trick)", space: "O(n)",
        code: `class Queue {
  constructor() { this.items = []; this.front = 0; }
  enqueue(x) { this.items.push(x); }
  dequeue() { return this.items[this.front++]; }
  peek() { return this.items[this.front]; }
  isEmpty() { return this.front === this.items.length; }
}`,
        variations: ["Circular Queue (reuses freed-up space at the front instead of letting the array grow forever)"],
        gotchas: ["Without the front-index trick, `array.shift()` is O(n) every single call — fine for small inputs, but a real bottleneck at scale."]
      },
      {
        name: "Implement a Stack using a Linked List",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/implement-a-stack-using-singly-linked-list/",
        idea: "Push and pop both happen at the 'top', so just make the top of the stack the head of a linked list. Pushing means inserting a new head; popping means removing the head — both O(1), no shifting anything.",
        time: "O(1) for push/pop/top", space: "O(n)",
        code: `class Stack {
  constructor() { this.head = null; }
  push(x) { this.head = { val: x, next: this.head }; }
  pop() { const v = this.head.val; this.head = this.head.next; return v; }
  top() { return this.head.val; }
  isEmpty() { return this.head === null; }
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Implement a Queue using a Linked List",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/implemention-queue-linked-list/",
        idea: "Keep a pointer to both the head (front, where you remove from) and the tail (back, where you add). Adding a node updates the tail; removing a node updates the head. Neither operation needs to touch the rest of the list.",
        time: "O(1) for enqueue/dequeue", space: "O(n)",
        code: `class Queue {
  constructor() { this.head = null; this.tail = null; }
  enqueue(x) {
    const node = { val: x, next: null };
    if (this.tail) this.tail.next = node; else this.head = node;
    this.tail = node;
  }
  dequeue() {
    const v = this.head.val;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    return v;
  }
}`,
        variations: [],
        gotchas: ["Don't forget to reset `tail` to null when the last node is removed — otherwise the next enqueue links onto a dangling node."]
      },
      {
        name: "Implement a Stack using a Queue",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/implement-stack-using-queues/",
        idea: "A queue naturally gives you the OPPOSITE order you want for a stack (first in, first out instead of last in, first out). The trick: every time you push a new element, immediately rotate the queue so the new element ends up at the front — push it in, then dequeue-and-requeue everyone who was already there. Now the most recently pushed element is always at the front, exactly like a stack's top.",
        time: "O(n) per push, O(1) for pop", space: "O(n)",
        code: `class MyStack {
  constructor() { this.q = []; }
  push(x) {
    this.q.push(x);
    for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
  }
  pop() { return this.q.shift(); }
  top() { return this.q[0]; }
}`,
        variations: [],
        gotchas: ["There's a symmetric version where you pay the O(n) cost on `pop` instead of `push` — either is a fine answer, just pick one and know why."]
      },
      {
        name: "Implement a Queue using Stacks",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/implement-queue-using-stacks/",
        idea: "Use two stacks: one for incoming elements, one for outgoing ones. Push always goes onto the 'in' stack. When you need to dequeue and the 'out' stack is empty, dump everything from 'in' into 'out' — that dump naturally reverses the order, turning last-in-first-out into first-in-first-out. Elements only ever get flipped once each, so it stays efficient overall.",
        time: "O(1) amortized for both enqueue and dequeue", space: "O(n)",
        code: `class MyQueue {
  constructor() { this.inStack = []; this.outStack = []; }
  enqueue(x) { this.inStack.push(x); }
  dequeue() {
    if (this.outStack.length === 0) {
      while (this.inStack.length) this.outStack.push(this.inStack.pop());
    }
    return this.outStack.pop();
  }
}`,
        variations: [],
        gotchas: ["Only refill `outStack` when it's completely empty — refilling too eagerly breaks the ordering and also wastes work."]
      }
    ]
  },

  {
    id: "bracket-matching",
    name: "Bracket & Expression Matching",
    color: "#c77dff",
    icon: "bracket-matching",
    trigger: "Matching opening/closing pairs — brackets, parentheses, tags — or evaluating an expression piece by piece",
    summary: "A stack is a natural fit whenever the most recent unmatched thing needs to be resolved first — exactly how nested brackets and expressions work.",
    problems: [
      {
        name: "Valid Parentheses",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/valid-parentheses/",
        idea: "Every time you see an opening bracket, push it onto a stack — it's now 'waiting' to be closed. Every time you see a closing bracket, it must match whatever's currently on top of the stack (the most recently opened, still-unmatched bracket); if it doesn't match, or the stack's empty, the string is invalid. At the very end, the stack should be completely empty — no leftover unmatched brackets.",
        time: "O(n)", space: "O(n)",
        code: `const pairs = { ')': '(', ']': '[', '}': '{' };
const stack = [];
for (const ch of s) {
  if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
  else {
    if (stack.pop() !== pairs[ch]) return false;
  }
}
return stack.length === 0;`,
        variations: ["Minimum Add to Make Parentheses Valid", "Remove Invalid Parentheses (a much harder, backtracking-flavored version)"],
        gotchas: ["Don't forget the final check — a string of only opening brackets passes every individual check but is still invalid overall."]
      },
      {
        name: "Minimum Add to Make Parentheses Valid",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
        idea: "You don't need a real stack here, just a counter standing in for 'how many unmatched opening brackets am I currently holding'. An unmatched closing bracket either cancels one from that counter, or — if there's nothing to cancel — is itself a bracket you'll need to add an opening match for later. Count both kinds of leftovers as you go.",
        time: "O(n)", space: "O(1)",
        code: `let open = 0, additions = 0;
for (const ch of s) {
  if (ch === '(') open++;
  else {
    if (open > 0) open--;
    else additions++;
  }
}
return additions + open;`,
        variations: [],
        gotchas: ["Any opening brackets still uncancelled at the end also need a matching closer added — don't forget to add `open` itself into the final answer."]
      },
      {
        name: "Evaluate Reverse Polish Notation",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        idea: "In postfix notation, an operator always applies to the two numbers that came right before it. Push numbers onto a stack as you see them; whenever you hit an operator, pop the top two numbers, apply the operator, and push the result back — that result now stands in for both numbers it came from.",
        time: "O(n)", space: "O(n)",
        code: `const stack = [];
for (const token of tokens) {
  if (!isNaN(token)) stack.push(Number(token));
  else {
    const b = stack.pop(), a = stack.pop();
    if (token === '+') stack.push(a + b);
    else if (token === '-') stack.push(a - b);
    else if (token === '*') stack.push(a * b);
    else stack.push(Math.trunc(a / b));
  }
}
return stack.pop();`,
        variations: [],
        gotchas: ["Order matters for subtraction and division — pop `b` first, then `a`, so you compute `a - b`, not `b - a`."]
      }
    ]
  },

  {
    id: "monotonic-stack-deque",
    name: "Monotonic Stack & Deque",
    color: "#ffb84d",
    icon: "monotonic-stack",
    trigger: "\"Next greater/smaller element\" · sliding window max/min · a stack or deque that's always increasing or always decreasing solves it in O(n)",
    summary: "Keep a stack (or a double-ended queue) that's always sorted in one direction. Each element gets pushed and popped at most once, so despite looking like nested loops, the whole thing runs in O(n).",
    problems: [
      {
        name: "Next Greater Element",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/next-greater-element-i/",
        idea: "Keep a stack of numbers that are still 'waiting' to find something bigger than them. When a new, bigger number shows up, it's exactly the answer for everyone smaller still waiting on the stack — pop them off and record the answer, then push the new number on as the next thing waiting.",
        time: "O(n)", space: "O(n)",
        code: `const stack = [], next = {};
for (let i = arr.length - 1; i >= 0; i--) {
  while (stack.length && stack[stack.length - 1] <= arr[i]) stack.pop();
  next[arr[i]] = stack.length ? stack[stack.length - 1] : -1;
  stack.push(arr[i]);
}`,
        variations: [],
        gotchas: []
      },
      {
        name: "Next Greater Element II (Circular Array)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/next-greater-element-ii/",
        idea: "The array wraps around, so an element near the end might find its 'next greater' back near the start. Simulate that wraparound cheaply by looping through the array twice (using `i % n` for the index) while running the exact same monotonic stack trick — no need to physically duplicate the array.",
        time: "O(n)", space: "O(n)",
        code: `const n = arr.length, res = new Array(n).fill(-1), stack = [];
for (let i = 2 * n - 1; i >= 0; i--) {
  const idx = i % n;
  while (stack.length && stack[stack.length - 1] <= arr[idx]) stack.pop();
  if (i < n) res[idx] = stack.length ? stack[stack.length - 1] : -1;
  stack.push(arr[idx]);
}`,
        variations: [],
        gotchas: ["Only record the answer during the second pass (`i < n`) — the first pass is just there to 'preload' the stack with wraparound candidates."]
      },
      {
        name: "Asteroid Collision",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/asteroid-collision/",
        idea: "Think of the stack as 'asteroids currently surviving, left to right'. A new asteroid only causes a collision if it's moving left (negative) while the top of the stack is moving right (positive) — otherwise it's safe to just push it on. When there IS a collision, whichever asteroid is smaller explodes; if they're equal, both explode; keep resolving collisions against the stack until the current asteroid either survives or is destroyed.",
        time: "O(n)", space: "O(n)",
        code: `const stack = [];
for (const a of asteroids) {
  let cur = a, alive = true;
  while (alive && cur < 0 && stack.length && stack[stack.length - 1] > 0) {
    const top = stack[stack.length - 1];
    if (top < -cur) stack.pop();          // top explodes
    else if (top === -cur) { stack.pop(); alive = false; } // both explode
    else alive = false;                    // cur explodes
  }
  if (alive) stack.push(cur);
}`,
        variations: [],
        gotchas: ["A collision only ever happens between a right-moving asteroid already on the stack and a new left-moving one — same-direction asteroids never collide."]
      },
      {
        name: "Sum of Subarray Minimums",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/sum-of-subarray-minimums/",
        idea: "Instead of checking every subarray, figure out — for each individual number — in how many subarrays IS it the minimum. That count depends on how far the number can 'see' in each direction before hitting something smaller, which is exactly what a monotonic stack finds efficiently (the nearest smaller element on each side). Multiply that reach by the number's value, and add it all up.",
        time: "O(n)", space: "O(n)",
        code: `// for each i, find distance to the nearest smaller element on the left
// and the nearest smaller-or-equal element on the right (using two
// monotonic increasing stacks), then:
// contribution of arr[i] = arr[i] * (left distance) * (right distance)
// sum all contributions, modulo 1e9+7`,
        variations: ["Sum of Subarray Ranges (max contribution minus min contribution, same idea run twice)"],
        gotchas: ["Use 'strictly smaller' on one side and 'smaller-or-equal' on the other — this avoids double-counting subarrays when there are duplicate values."]
      },
      {
        name: "Sum of Subarray Ranges",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/sum-of-subarray-ranges/",
        idea: "A subarray's 'range' is (its max minus its min). So the total answer is just (sum of every subarray's maximum) minus (sum of every subarray's minimum) — and both of those are exactly the 'Sum of Subarray Minimums' trick, run once for minimums and once for maximums with the comparison flipped.",
        time: "O(n)", space: "O(n)",
        code: `// sumOfMins = Sum of Subarray Minimums technique
// sumOfMaxs = same technique, but tracking nearest GREATER element instead
// answer = sumOfMaxs - sumOfMins`,
        variations: [],
        gotchas: ["If you've already solved Sum of Subarray Minimums, this is barely a new problem — just run the same idea twice."]
      },
      {
        name: "Remove K Digits",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/remove-k-digits/",
        idea: "To make the smallest possible number, you want small digits as far to the left as possible. Walk through the digits keeping an increasing stack: whenever the next digit is smaller than what's on top of the stack, popping that bigger digit off (as long as you still have removals left) always helps, since a smaller digit earlier beats a bigger digit earlier. After the walk, remove any leftover digits from the end if you haven't used up all k removals yet.",
        time: "O(n)", space: "O(n)",
        code: `const stack = [];
let toRemove = k;
for (const d of num) {
  while (toRemove > 0 && stack.length && stack[stack.length - 1] > d) {
    stack.pop(); toRemove--;
  }
  stack.push(d);
}
while (toRemove-- > 0) stack.pop();
const result = stack.join('').replace(/^0+/, '') || '0';`,
        variations: [],
        gotchas: ["Strip leading zeros from the result, and remember an all-zero result should just be \"0\", not an empty string."]
      },
      {
        name: "Sliding Window Maximum",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/sliding-window-maximum/",
        idea: "This is the deque version of a monotonic stack. Keep a double-ended queue of indices with DEcreasing values — whenever a new number arrives, kick out everyone at the back of the deque who's smaller than it (they can never be the max again while this bigger number is around). The front of the deque is always the current window's maximum; just make sure to also drop the front if it's slid outside the window.",
        time: "O(n)", space: "O(k)",
        code: `const deque = []; // stores indices, values decreasing
const result = [];
for (let i = 0; i < arr.length; i++) {
  if (deque.length && deque[0] <= i - k) deque.shift(); // out of window
  while (deque.length && arr[deque[deque.length - 1]] <= arr[i]) deque.pop();
  deque.push(i);
  if (i >= k - 1) result.push(arr[deque[0]]);
}`,
        variations: [],
        gotchas: ["Store indices in the deque, not values — you need the index to know when an entry has slid out of the window."]
      }
    ]
  },

  {
    id: "area-water",
    name: "Stack-Based Area & Water Problems",
    color: "#4dd0e1",
    icon: "area-water",
    trigger: "A row of bars/heights where you need the biggest rectangle they can form, or how much water collects between them",
    summary: "A handful of the trickiest-looking array/stack problems all reduce to the same question: for this bar, how far can I stretch left and right before hitting something that stops me?",
    problems: [
      {
        name: "Trapping Rain Water",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/trapping-rain-water/",
        idea: "Water sitting above any bar is limited by whichever is shorter: the tallest wall to its left, or the tallest wall to its right. A decreasing stack of bar indices lets you find exactly that — when a taller bar finally shows up, it 'closes off' a basin, so pop the shorter bar in between and calculate how much water it could hold using the gap width and the height bounded by the new wall.",
        time: "O(n)", space: "O(n) (or O(1) with a two-pointer version)",
        code: `const stack = []; let water = 0;
for (let i = 0; i < h.length; i++) {
  while (stack.length && h[i] > h[stack[stack.length - 1]]) {
    const top = stack.pop();
    if (!stack.length) break;
    const dist = i - stack[stack.length - 1] - 1;
    const boundedH = Math.min(h[i], h[stack[stack.length - 1]]) - h[top];
    water += dist * boundedH;
  }
  stack.push(i);
}`,
        variations: ["A two-pointer version using running left-max/right-max needs no extra memory — worth learning both."],
        gotchas: []
      },
      {
        name: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        idea: "For every bar, the biggest rectangle using its height is limited by how far you can stretch left and right before hitting something shorter. Keep an increasing stack of bar positions. The moment a shorter bar shows up, every taller bar still on the stack has just found its right-hand limit — pop each one and compute its rectangle using its own height and the gap to its new stack neighbor.",
        time: "O(n)", space: "O(n)",
        code: `const stack = []; let best = 0;
for (let i = 0; i <= h.length; i++) {
  const cur = i === h.length ? 0 : h[i];
  while (stack.length && h[stack[stack.length - 1]] >= cur) {
    const height = h[stack.pop()];
    const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
    best = Math.max(best, height * width);
  }
  stack.push(i);
}`,
        variations: ["Maximal Rectangle (run this once per row of a 2D grid)"],
        gotchas: ["Adding a fake bar of height 0 at the very end forces the stack to fully drain, resolving every bar left on it."]
      },
      {
        name: "Maximal Rectangle",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/maximal-rectangle/",
        idea: "Turn this 2D grid problem into several 1D problems you already know how to solve. For each row, treat every column as a 'bar' whose height is how many consecutive 1s are stacked above it (including this row) — then just run Largest Rectangle in Histogram on that row's heights. Do this once per row and keep the best answer across all of them.",
        time: "O(rows · cols)", space: "O(cols)",
        code: `// heights[j] = number of consecutive 1s ending at the current row, in column j
// (reset to 0 whenever a 0 appears, otherwise heights[j]++)
// run Largest Rectangle in Histogram on 'heights' after processing each row
// track the best rectangle seen across all rows`,
        variations: [],
        gotchas: ["Building the per-row heights array incrementally (rather than recomputing from scratch) is what keeps this from becoming much slower than O(rows · cols)."]
      },
      {
        name: "Stock Span Problem",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/the-stock-span-problem/",
        idea: "The 'span' for today is just: how many consecutive days going backward (including today) had a price less than or equal to today's? Keep a decreasing stack of (price, span) pairs. Any earlier day with a smaller-or-equal price gets absorbed into today's span — pop them off and add up their spans before pushing today's total span on.",
        time: "O(n)", space: "O(n)",
        code: `const stack = []; // pairs of [price, span]
const spans = [];
for (const price of prices) {
  let span = 1;
  while (stack.length && stack[stack.length - 1][0] <= price) {
    span += stack.pop()[1];
  }
  stack.push([price, span]);
  spans.push(span);
}`,
        variations: [],
        gotchas: ["This is really 'Next Greater Element' in reverse — instead of a next-greater index, you're accumulating a running count of everything smaller-or-equal that came before."]
      }
    ]
  },

  {
    id: "design-structures",
    name: "Design: Stack/Queue-Based Structures",
    color: "#ff8a80",
    icon: "design-structures",
    trigger: "Design a class with specific operation guarantees — O(1) getMin, least-recently/frequently-used, or eliminating candidates one at a time",
    summary: "These questions ask you to build a small data structure with extra powers on top of a stack or queue — usually by keeping a second helper structure alongside the main one.",
    problems: [
      {
        name: "Min Stack",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/min-stack/",
        idea: "A normal stack can't tell you its minimum without scanning everything. Fix it by keeping a SECOND stack alongside the first, which tracks 'the minimum so far' at every point in time. Every push also pushes the current running minimum onto the second stack; every pop removes from both — so the top of the second stack is always the minimum of whatever's currently in the main stack.",
        time: "O(1) for every operation", space: "O(n)",
        code: `class MinStack {
  constructor() { this.stack = []; this.minStack = []; }
  push(x) {
    this.stack.push(x);
    const currentMin = this.minStack.length ? Math.min(x, this.minStack[this.minStack.length - 1]) : x;
    this.minStack.push(currentMin);
  }
  pop() { this.stack.pop(); this.minStack.pop(); }
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.minStack[this.minStack.length - 1]; }
}`,
        variations: [],
        gotchas: ["Pop from BOTH stacks together, always — they need to stay perfectly in sync or `getMin` starts lying."]
      },
      {
        name: "LRU Cache",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/lru-cache/",
        idea: "You need O(1) lookups (a hashmap does that) AND O(1) 'move this to the most-recently-used end' (a doubly linked list does that, since you can splice a node out and back in without shifting anything). Combine both: the hashmap maps keys to nodes in the list, and the list's order tracks recency — most recent at one end, least recent at the other, ready to evict.",
        time: "O(1) for get and put", space: "O(capacity)",
        code: `// hashmap: key -> node in a doubly linked list
// on get(key): if found, move that node to the "most recent" end, return its value
// on put(key, val): if key exists, update value and move to "most recent" end
//                    otherwise insert a new node at the "most recent" end;
//                    if now over capacity, remove the node at the "least recent" end`,
        variations: ["LFU Cache (evict by frequency of use instead of recency)"],
        gotchas: ["Use a dummy head AND a dummy tail node in the linked list — it removes every awkward edge case around inserting/removing at the very ends."]
      },
      {
        name: "LFU Cache",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/lfu-cache/",
        idea: "This extends LRU Cache: now you evict based on which key was used LEAST OFTEN, not least recently — with recency only used to break ties among equally-frequent keys. Keep a hashmap of key → node, and group nodes by their use-count into separate 'recency lists' (one doubly linked list per frequency). When a key gets used, bump it from its current frequency's list into the next frequency's list.",
        time: "O(1) for get and put", space: "O(capacity)",
        code: `// keyMap: key -> node (value, frequency)
// freqMap: frequency -> doubly linked list of nodes with that frequency,
//          ordered by recency within that frequency
// track minFreq so eviction always knows which frequency list to pull from
// on access: move the node from freqMap[f] to freqMap[f+1], bump minFreq if needed`,
        variations: [],
        gotchas: ["This is genuinely fiddly to implement cleanly — most people only need to know the SHAPE of the approach (hashmap + per-frequency lists), not have it memorized line for line."]
      },
      {
        name: "The Celebrity Problem",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/the-celebrity-problem/",
        idea: "A 'celebrity' is someone everyone knows but who knows nobody. Instead of checking every pair of people (O(n²)), eliminate candidates two at a time: compare two people — whoever 'knows' the other can't possibly be the celebrity, so throw them out and keep the other as the remaining candidate. After narrowing down to one final candidate, do one pass to confirm they actually satisfy the celebrity property.",
        time: "O(n)", space: "O(1) (or O(n) if you use an actual stack to eliminate people)",
        code: `let candidate = 0;
for (let i = 1; i < n; i++) {
  if (knows(candidate, i)) candidate = i; // candidate knows i, so candidate can't be the celebrity
  // else: i knows candidate (or doesn't matter) — i is ruled out, candidate stays
}
// verify: candidate must know no one, and everyone else must know candidate
for (let i = 0; i < n; i++) {
  if (i !== candidate && (knows(candidate, i) || !knows(i, candidate))) return -1;
}
return candidate;`,
        variations: [],
        gotchas: ["The elimination pass only narrows down to ONE possible candidate — you still need the verification pass, since it's possible no celebrity exists at all."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Building a stack/queue, or one using the other", pattern: "stack-fundamentals" },
  { keyword: "Matching brackets or evaluating an expression", pattern: "bracket-matching" },
  { keyword: "\"Next greater/smaller\" or sliding window max/min", pattern: "monotonic-stack-deque" },
  { keyword: "Biggest rectangle or water trapped between bars", pattern: "area-water" },
  { keyword: "Design a cache or a stack with extra powers", pattern: "design-structures" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.stacksqueues = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();