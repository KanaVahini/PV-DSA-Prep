// ============================================================
// DSA Arrays — Pattern Data
// Structure is intentionally topic-agnostic so this file can be
// duplicated (data-strings.js, data-trees.js ...) and wired into
// the same UI later.
// ============================================================

const TOPIC = {
  id: "arrays",
  title: "Arrays",
  tagline: "Every array question is a disguise. Learn the pattern underneath, not the problem on top."
};

const PATTERNS = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    color: "#5b8def",
    icon: "two-pointers",
    trigger: "Sorted array + find a pair · \"reverse in place\" · \"remove duplicates in place\" · palindrome check",
    summary: "Two positions move toward each other (or together) so you only go through the array once, instead of comparing every pair.",
    problems: [
      {
        name: "Two Sum II (sorted array)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        idea: "Since the array is sorted, you don't have to check every pair one by one. Put one finger at the start and one at the end. If the two numbers add up to less than the target, the only way to get a bigger sum is to move the left finger forward. If it's too big, move the right finger back. You're never wasting a check.",
        time: "O(n)", space: "O(1)",
        code: `let l = 0, r = arr.length - 1;
while (l < r) {
  const sum = arr[l] + arr[r];
  if (sum === target) return [l, r];
  sum < target ? l++ : r--;
}`,
        variations: ["3Sum / 4Sum (fix outer index, two-pointer the rest)", "Two sum closest to target"],
        gotchas: ["This trick only works because the array is sorted — sort it first if it isn't (adds extra time)."]
      },
      {
        name: "3Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/3sum/",
        idea: "Sort the array first. Then pick one number at a time to be 'the first number', and use the two-pointer trick from Two Sum on the rest of the array to find two more numbers that cancel it out to zero. So a 3-number problem turns into a bunch of 2-number problems you already know how to solve.",
        time: "O(n²)", space: "O(1) extra (excl. output)",
        code: `arr.sort((a,b)=>a-b);
for (let i = 0; i < arr.length - 2; i++) {
  if (i > 0 && arr[i] === arr[i-1]) continue; // skip dupes
  let l = i+1, r = arr.length-1;
  while (l < r) {
    const sum = arr[i]+arr[l]+arr[r];
    if (sum === 0) { record(); l++; r--; while(arr[l]===arr[l-1]) l++; }
    else sum < 0 ? l++ : r--;
  }
}`,
        variations: ["3Sum Closest", "4Sum (one more fixed loop)"],
        gotchas: ["Skipping repeated numbers is the part people forget — do it for all three positions, not just the first."]
      },
      {
        name: "Container With Most Water",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/container-with-most-water/",
        idea: "Start with the two walls farthest apart — that gives you the most width to work with, even if one wall is short. The water level is always limited by whichever wall is shorter. So moving the taller wall inward can't possibly help (width shrinks, height stays capped by the short one) — only moving the shorter wall has a chance of finding something better.",
        time: "O(n)", space: "O(1)",
        code: `let l=0, r=arr.length-1, best=0;
while (l<r) {
  best = Math.max(best, Math.min(arr[l],arr[r])*(r-l));
  arr[l] < arr[r] ? l++ : r--;
}`,
        variations: ["Trapping Rain Water (needs prefix max on both sides too)"],
        gotchas: ["Try to explain to yourself why you always move the shorter wall — interviewers love asking this as a follow-up."]
      },
      {
        name: "Sort Colors (Dutch flag)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/sort-colors/",
        idea: "Instead of actually sorting, split the array into three zones as you go: 0s at the front, 2s at the back, and 1s left in the middle. Keep three markers — one for where the next 0 should go, one for the number you're currently looking at, and one for where the next 2 should go. Swap numbers into the right zone as you scan through once.",
        time: "O(n)", space: "O(1)",
        code: `let low=0, mid=0, high=arr.length-1;
while (mid <= high) {
  if (arr[mid]===0) { swap(low++, mid++); }
  else if (arr[mid]===1) mid++;
  else swap(mid, high--);
}`,
        variations: ["Move Zeroes", "Segregate even/odd"],
        gotchas: ["When you swap a 2 to the back, don't move your 'current' marker forward yet — you haven't looked at the new number that just landed there."]
      },
      {
        name: "Valid Palindrome (array/string)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/valid-palindrome/",
        idea: "A palindrome reads the same from both ends. So just compare the first and last character, then the second and second-to-last, and keep moving inward. The moment two characters don't match, you can stop — it's not a palindrome.",
        time: "O(n)", space: "O(1)",
        code: `let l=0, r=s.length-1;
while (l<r) { if (s[l]!==s[r]) return false; l++; r--; }
return true;`,
        variations: ["Valid Palindrome II (allow one deletion)"],
        gotchas: []
      }
    ]
  },

  {
    id: "sliding-window",
    name: "Sliding Window",
    color: "#f2994a",
    icon: "sliding-window",
    trigger: "\"Contiguous subarray/substring\" + a size k, or a max/min/longest/shortest under some rule",
    summary: "Keep a 'window' over part of the array. Grow it on the right, shrink it on the left when needed — so you never re-scan the same numbers twice.",
    problems: [
      {
        name: "Maximum Sum Subarray of Size K",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/window-sliding-technique/",
        idea: "The slow way re-adds every number in the window each time it moves. Instead, just keep a running total: when the window slides over by one, add the new number that entered and subtract the one that just left. That's it — no need to re-add everything from scratch.",
        time: "O(n)", space: "O(1)",
        code: `let windowSum=0, best=-Infinity;
for (let r=0; r<arr.length; r++) {
  windowSum += arr[r];
  if (r >= k-1) {
    best = Math.max(best, windowSum);
    windowSum -= arr[r-k+1];
  }
}`,
        variations: ["Average of subarrays of size k"],
        gotchas: ["This is a fixed-size window: exactly one number comes in and one goes out at every step."]
      },
      {
        name: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        idea: "Grow the window to the right, and remember the last position you saw each character. If you hit a character that's already inside your current window, jump the left edge straight past where you last saw it — don't shrink one step at a time, just jump directly there. That's what keeps this fast.",
        time: "O(n)", space: "O(min(n, charset))",
        code: `let l=0, best=0, seen=new Map();
for (let r=0; r<s.length; r++) {
  if (seen.has(s[r]) && seen.get(s[r])>=l) l = seen.get(s[r])+1;
  seen.set(s[r], r);
  best = Math.max(best, r-l+1);
}`,
        variations: ["Longest substring with at most K distinct characters", "Longest repeating character replacement"],
        gotchas: ["Jump straight to 'last seen position + 1' — shrinking one step at a time is the slow, wrong way to do this."]
      },
      {
        name: "Minimum Size Subarray Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/minimum-size-subarray-sum/",
        idea: "This time you want the smallest window that still works, not the biggest. Grow the window until its sum finally reaches the target. Then, since you want it small, shrink from the left as much as you can while it's still valid, and remember the smallest size you managed.",
        time: "O(n)", space: "O(1)",
        code: `let l=0, sum=0, best=Infinity;
for (let r=0; r<arr.length; r++) {
  sum += arr[r];
  while (sum >= target) {
    best = Math.min(best, r-l+1);
    sum -= arr[l++];
  }
}`,
        variations: ["Subarray Product Less Than K"],
        gotchas: ["Use a `while` loop for the shrinking step, not an `if` — you may need to shrink several times in a row."]
      },
      {
        name: "Longest Substring with At Most K Distinct Characters",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/",
        idea: "Keep a count of how many times each character appears inside your current window. Grow the window to the right. The moment you have more than k different characters, shrink from the left — removing characters from your count — until you're back down to k or fewer.",
        time: "O(n)", space: "O(k)",
        code: `let l=0, best=0, freq=new Map();
for (let r=0; r<s.length; r++) {
  freq.set(s[r], (freq.get(s[r])||0)+1);
  while (freq.size > k) {
    freq.set(s[l], freq.get(s[l])-1);
    if (freq.get(s[l])===0) freq.delete(s[l]);
    l++;
  }
  best = Math.max(best, r-l+1);
}`,
        variations: ["Fruit Into Baskets (same problem, K=2)"],
        gotchas: []
      },
      {
        name: "Max Consecutive Ones III",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/max-consecutive-ones-iii/",
        idea: "You're allowed to flip up to k zeros into ones. So think of it as: a window is allowed to contain at most k zeros. Grow the window freely, and whenever it has more than k zeros inside, shrink from the left until it's back to k or fewer.",
        time: "O(n)", space: "O(1)",
        code: `let l=0, zeros=0, best=0;
for (let r=0; r<arr.length; r++) {
  if (arr[r]===0) zeros++;
  while (zeros>k) { if (arr[l]===0) zeros--; l++; }
  best = Math.max(best, r-l+1);
}`,
        variations: [],
        gotchas: ["This is the exact same shape as the 'at most K distinct characters' problem above — just spot the pattern, not the story."]
      }
    ]
  },

  {
    id: "prefix-sum",
    name: "Prefix Sum / Suffix Sum",
    color: "#9b6bf2",
    icon: "prefix-sum",
    trigger: "Answering many 'sum of this range' questions · \"subarray sum equals X\" · need product/sum of everything except one number",
    summary: "Do the adding once, upfront. Then any range sum becomes a single subtraction instead of re-adding numbers every time you're asked.",
    problems: [
      {
        name: "Range Sum Query - Immutable",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/range-sum-query-immutable/",
        idea: "If you're going to be asked 'what's the sum from here to there?' again and again, don't re-add the numbers every single time. Build one running-total array upfront. After that, the sum of any range is just one subtraction: total up to the end, minus total up to just before the start.",
        time: "O(1) per question after building it once", space: "O(n)",
        code: `const prefix=[0];
for (const x of arr) prefix.push(prefix[prefix.length-1]+x);
const rangeSum = (l,r) => prefix[r+1]-prefix[l];`,
        variations: ["Range Sum Query 2D (same idea, but for a grid)"],
        gotchas: ["Start the running-total array with a 0 at the front — it saves you from special-casing the very first range."]
      },
      {
        name: "Subarray Sum Equals K",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/subarray-sum-equals-k/",
        idea: "A stretch of numbers sums to k exactly when: (running total right now) minus (running total earlier) equals k. So as you scan and keep a running total, ask a hashmap: 'have I seen a running total of (current total minus k) before?' Every time yes, that's one more valid stretch ending here.",
        time: "O(n)", space: "O(n)",
        code: `let sum=0, count=0;
const seen = new Map([[0,1]]);
for (const x of arr) {
  sum += x;
  count += seen.get(sum-k) || 0;
  seen.set(sum, (seen.get(sum)||0)+1);
}`,
        variations: ["Continuous Subarray Sum (divisible by k)", "Subarray sums divisible by K"],
        gotchas: ["Start the map with {0: 1} — this accounts for a stretch that starts right from the beginning of the array."]
      },
      {
        name: "Product of Array Except Self",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/product-of-array-except-self/",
        idea: "'Everything except me' is really just 'everything to my left' times 'everything to my right'. Walk left to right, keeping a running product of everything before each spot. Then walk right to left doing the same thing for everything after each spot, multiplying both together. No division involved, so it even works if the array has a zero in it.",
        time: "O(n)", space: "O(1) extra (not counting the output)",
        code: `const res = new Array(n).fill(1);
let prefix=1;
for (let i=0;i<n;i++){ res[i]=prefix; prefix*=arr[i]; }
let suffix=1;
for (let i=n-1;i>=0;i--){ res[i]*=suffix; suffix*=arr[i]; }`,
        variations: [],
        gotchas: ["The whole point of this question is doing it without division — make sure you can explain why division would be risky (zeros!)."]
      },
      {
        name: "Find Pivot Index",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/find-pivot-index/",
        idea: "You're looking for a spot where everything to the left adds up to the same as everything to the right. Add up the whole array once. Then walk left to right, keeping a running left-side total — the right-side total at any point is just (whole array total) minus (left total) minus (the current number).",
        time: "O(n)", space: "O(1)",
        code: `const total = arr.reduce((a,b)=>a+b,0);
let leftSum=0;
for (let i=0;i<arr.length;i++){
  if (leftSum === total-leftSum-arr[i]) return i;
  leftSum += arr[i];
}`,
        variations: [],
        gotchas: []
      }
    ]
  },

  {
    id: "kadane",
    name: "Kadane's Algorithm",
    color: "#f2597a",
    icon: "kadane",
    trigger: "\"Maximum or minimum sum (or product) of a contiguous stretch of numbers\"",
    summary: "At each number, ask one simple question: does adding me to what came before make things better, or should I just start over from here?",
    problems: [
      {
        name: "Maximum Subarray",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximum-subarray/",
        idea: "At every number, you only have one real choice: keep building on the stretch you already have, or throw it away and start fresh from this number. If your running total has gone negative, it's only dragging you down — it's always better to drop it and restart. Making that one small choice at every step, over and over, ends up finding the best answer overall.",
        time: "O(n)", space: "O(1)",
        code: `let cur=arr[0], best=arr[0];
for (let i=1;i<arr.length;i++){
  cur = Math.max(arr[i], cur+arr[i]);
  best = Math.max(best, cur);
}`,
        variations: ["Maximum Circular Subarray Sum (total minus the minimum subarray, with a special case for all-negative arrays)"],
        gotchas: ["This already handles negative numbers correctly on its own — no extra work needed unless it's the circular version."]
      },
      {
        name: "Maximum Product Subarray",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximum-product-subarray/",
        idea: "With sums, bigger running totals are always safer. But with products, a very negative number times another negative number suddenly becomes a big positive number! So you have to track both the biggest AND the smallest running product at every step — because the smallest one might flip into the biggest one on the very next step.",
        time: "O(n)", space: "O(1)",
        code: `let maxP=arr[0], minP=arr[0], best=arr[0];
for (let i=1;i<arr.length;i++){
  if (arr[i]<0) [maxP,minP]=[minP,maxP];
  maxP = Math.max(arr[i], maxP*arr[i]);
  minP = Math.min(arr[i], minP*arr[i]);
  best = Math.max(best, maxP);
}`,
        variations: [],
        gotchas: ["Tracking the minimum alongside the maximum is the entire trick here — that's what makes this different from plain Kadane."]
      },
      {
        name: "Maximum Circular Subarray Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/maximum-sum-circular-subarray/",
        idea: "There are only two possibilities: either the best stretch doesn't wrap around the end of the array (plain Kadane finds it), or it does wrap around — which is the same as taking everything except the worst middle stretch (total sum minus the minimum subarray). Compute both and take whichever is bigger.",
        time: "O(n)", space: "O(1)",
        code: `// maxKadane and minKadane computed normally
// if all elements negative, answer = maxKadane
// else answer = max(maxKadane, total - minKadane)`,
        variations: [],
        gotchas: ["If every number is negative, the 'total minus minimum' trick breaks (it gives an empty array) — handle that case separately."]
      }
    ]
  },

  {
    id: "binary-search",
    name: "Binary Search on Arrays",
    color: "#4fb0e0",
    icon: "binary-search",
    trigger: "Sorted (or rotated-sorted) array · \"find it fast\" · \"find the smallest/largest value that still works\" (binary search on the answer)",
    summary: "Cut the search space in half every time. Also works beyond just finding a number — it can find the best value that satisfies some condition.",
    problems: [
      {
        name: "Binary Search (classic)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/binary-search/",
        idea: "Because the array is sorted, you never need to check every single number. Look at the middle one — if your target is bigger, it must be in the right half; if smaller, it's in the left half. Either way, you just threw away half the array without even checking it. Keep doing that until you find it.",
        time: "O(log n)", space: "O(1)",
        code: `let l=0, r=arr.length-1;
while (l<=r) {
  const m = l + ((r-l)>>1);
  if (arr[m]===target) return m;
  arr[m]<target ? l=m+1 : r=m-1;
}
return -1;`,
        variations: ["Finding the first or last position of a value in a sorted array"],
        gotchas: ["Writing `l + (r-l)/2` instead of `(l+r)/2` avoids a rare overflow bug in other languages — good habit either way."]
      },
      {
        name: "Search in Rotated Sorted Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        idea: "A rotated sorted array looks messy, but here's the trick: no matter where you split it in half, at least ONE of the two halves is still perfectly sorted. So check which half is sorted, see if your target could be hiding in that sorted half, and search there. Otherwise, search the other half.",
        time: "O(log n)", space: "O(1)",
        code: `let l=0, r=arr.length-1;
while (l<=r) {
  const m=(l+r)>>1;
  if (arr[m]===target) return m;
  if (arr[l]<=arr[m]) { // left half sorted
    if (arr[l]<=target && target<arr[m]) r=m-1; else l=m+1;
  } else { // right half sorted
    if (arr[m]<target && target<=arr[r]) l=m+1; else r=m-1;
  }
}`,
        variations: ["Same problem but with duplicate numbers allowed", "Find the smallest number in a rotated sorted array"],
        gotchas: ["If there are duplicate numbers at both ends, you sometimes can't tell which half is sorted — just shrink both ends by one and try again."]
      },
      {
        name: "Find Minimum in Rotated Sorted Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        idea: "The smallest number is sitting exactly where the sorted order 'breaks'. Compare the middle number to the rightmost one: if the middle is bigger, the break (and the minimum) must be somewhere to its right. Otherwise, the minimum is the middle number itself or somewhere to its left.",
        time: "O(log n)", space: "O(1)",
        code: `let l=0, r=arr.length-1;
while (l<r) {
  const m=(l+r)>>1;
  arr[m]>arr[r] ? l=m+1 : r=m;
}
return arr[l];`,
        variations: [],
        gotchas: []
      },
      {
        name: "Koko Eating Bananas (binary search on the answer)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/koko-eating-bananas/",
        idea: "This is a different way to use binary search — not to find a number in the array, but to find the best possible ANSWER to a question. Notice that eating faster always means finishing in fewer-or-equal hours — that's a predictable, one-direction relationship. So guess a speed, check if it's fast enough, and binary search on the guess itself until you find the slowest speed that still works.",
        time: "O(n log(biggest pile))", space: "O(1)",
        code: `let l=1, r=Math.max(...piles);
while (l<r) {
  const m=(l+r)>>1;
  const hours = piles.reduce((h,p)=>h+Math.ceil(p/m),0);
  hours<=h ? r=m : l=m+1;
}
return l;`,
        variations: ["Capacity To Ship Packages Within D Days", "Split Array Largest Sum", "Minimum Days to Make M Bouquets"],
        gotchas: ["Once you recognize this shape — 'find the smallest number that still works' — you'll start seeing it everywhere in medium/hard problems."]
      }
    ]
  },

  {
    id: "hashing",
    name: "Hashing / Frequency Counting",
    color: "#2fbf9f",
    icon: "hashing",
    trigger: "\"Have I seen this before?\" · counting how often something appears · finding pairs/duplicates faster than checking every pair",
    summary: "Keep a lookup table (hashmap or set) so 'have I seen this before?' becomes an instant check instead of scanning the whole array again.",
    problems: [
      {
        name: "Two Sum",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/two-sum/",
        idea: "You don't need to check every possible pair of numbers. You just need to ask, for each number: 'have I already seen the number that would complete this pair?' A hashmap answers that instantly. So walk through once, and before adding the current number to your map, check if its 'partner' is already there.",
        time: "O(n)", space: "O(n)",
        code: `const seen = new Map();
for (let i=0;i<arr.length;i++){
  const need = target - arr[i];
  if (seen.has(need)) return [seen.get(need), i];
  seen.set(arr[i], i);
}`,
        variations: ["Two Sum II (if the array is sorted, use two pointers instead — no extra space needed)"],
        gotchas: ["Check for the partner BEFORE adding the current number — otherwise you might accidentally pair a number with itself."]
      },
      {
        name: "Majority Element",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/majority-element/",
        idea: "A frequency hashmap works fine, but there's a neat trick: since this number shows up more than everything else combined, think of matching numbers as +1 votes and everything else as -1 votes. Keep a running candidate and a vote count; when the count hits zero, switch to a new candidate. Whoever survives at the end is the answer.",
        time: "O(n)", space: "O(n) with a hashmap, or O(1) with the voting trick",
        code: `let count=0, candidate=null;
for (const x of arr) {
  if (count===0) candidate=x;
  count += (x===candidate) ? 1 : -1;
}`,
        variations: ["Majority Element II (numbers appearing more than n/3 times)"],
        gotchas: ["The voting trick only works because the problem guarantees a majority number actually exists."]
      },
      {
        name: "Longest Consecutive Sequence",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/longest-consecutive-sequence/",
        idea: "Put every number in a set for instant lookups. To avoid counting the same sequence multiple times, only start counting from a number that looks like the START of a sequence — meaning (number - 1) is NOT in the set. From there, keep checking number+1, number+2, and so on for as long as they exist.",
        time: "O(n)", space: "O(n)",
        code: `const set = new Set(arr);
let best=0;
for (const x of set) {
  if (!set.has(x-1)) {
    let len=1;
    while (set.has(x+len)) len++;
    best=Math.max(best,len);
  }
}`,
        variations: [],
        gotchas: ["Only starting from sequence beginnings is what keeps this fast — without that check, you'd re-count the same sequence over and over."]
      },
      {
        name: "Group Anagrams",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/group-anagrams/",
        idea: "Two words are anagrams when they have exactly the same letters, just shuffled. So if you sort the letters of any word alphabetically, anagrams become IDENTICAL strings. Use that sorted string as a hashmap key — every word with the same key belongs in the same group.",
        time: "O(n · k log k)", space: "O(n·k)",
        code: `const groups = new Map();
for (const s of strs) {
  const key = s.split('').sort().join('');
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(s);
}`,
        variations: [],
        gotchas: ["For very long words, counting each letter (instead of sorting) is a bit faster."]
      },
      {
        name: "Contains Duplicate II",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/contains-duplicate-ii/",
        idea: "You need to know two things: is this a repeat, and is it close enough (within k spots)? Keep a hashmap of each number's last-seen position. If you see the number again and the gap between positions is k or less, you're done.",
        time: "O(n)", space: "O(n)",
        code: `const last = new Map();
for (let i=0;i<arr.length;i++){
  if (last.has(arr[i]) && i-last.get(arr[i])<=k) return true;
  last.set(arr[i], i);
}`,
        variations: [],
        gotchas: []
      }
    ]
  },

  {
    id: "cyclic-sort",
    name: "Cyclic Sort",
    color: "#e0b23f",
    icon: "cyclic-sort",
    trigger: "Numbers in the array are between 1 and n (or 0 and n-1) · \"find the missing or duplicate number\" without using extra space",
    summary: "Since every number has a 'home' spot based on its value, you can swap each number into its home in one pass — no sorting algorithm and no extra space needed.",
    problems: [
      {
        name: "Missing Number",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/missing-number/",
        idea: "Since the numbers are limited to a known range, each one has an exact spot it 'belongs' at. Walk through and swap each number into its home spot. Once that's done, whichever spot doesn't have the right number sitting in it tells you what's missing. (There's also a simple 'add up the numbers and compare' shortcut, but this swapping idea is what you'll need for the harder versions below.)",
        time: "O(n)", space: "O(1)",
        code: `let i=0;
while (i<n) {
  const correct = arr[i];
  if (correct<n && arr[i]!==arr[correct]) swap(i, correct);
  else i++;
}
for (i=0;i<n;i++) if (arr[i]!==i) return i;
return n;`,
        variations: [],
        gotchas: ["The sum shortcut (expected total minus actual total) is quicker to write but doesn't help you solve the trickier variants below."]
      },
      {
        name: "Find All Duplicates in an Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
        idea: "Same 'put every number in its home spot' idea as Missing Number. Once everything's been swapped into place, any spot that doesn't hold its correct number means two copies of the same value fought over the same spot — and that value is a duplicate.",
        time: "O(n)", space: "O(1) extra",
        code: `let i=0;
while (i<n) {
  const correct = arr[i]-1;
  if (arr[i]!==arr[correct]) swap(i, correct); else i++;
}
const dupes=[];
for (i=0;i<n;i++) if (arr[i]!==i+1) dupes.push(arr[i]);`,
        variations: ["Find the Duplicate Number (a clever cycle-detection trick avoids changing the array at all)"],
        gotchas: []
      },
      {
        name: "First Missing Positive",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/first-missing-positive/",
        idea: "The answer has to be somewhere between 1 and (array length + 1), so any number outside that range — negatives, zero, or numbers way too big — can just be ignored while sorting. Do the same 'swap into home spot' trick, but only for numbers that fit, then find the first spot that doesn't hold what it should.",
        time: "O(n)", space: "O(1)",
        code: `let i=0;
while (i<n) {
  const correct = arr[i]-1;
  if (arr[i]>0 && arr[i]<=n && arr[i]!==arr[correct]) swap(i, correct);
  else i++;
}
for (i=0;i<n;i++) if (arr[i]!==i+1) return i+1;
return n+1;`,
        variations: [],
        gotchas: ["This is the trickiest of the three — if you can figure this out on your own after doing Missing Number, you've really got the pattern."]
      }
    ]
  },

  {
    id: "merge-intervals",
    name: "Merge Intervals",
    color: "#e06a5f",
    icon: "merge-intervals",
    trigger: "Array of [start, end] pairs · \"overlapping\", \"merge\", \"insert a new interval\", \"free time / meeting rooms\"",
    summary: "Sort by start time first — nearly always. Then walk through once, comparing each interval to the last one you kept.",
    problems: [
      {
        name: "Merge Intervals",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/merge-intervals/",
        idea: "You can only tell which intervals overlap once they're in order by start time — so always sort first. Then go through once: if the current interval starts before (or right when) the last one you kept ends, they overlap, so stretch the last one to cover both. Otherwise, it's a brand new group.",
        time: "O(n log n)", space: "O(n)",
        code: `intervals.sort((a,b)=>a[0]-b[0]);
const res=[intervals[0]];
for (let i=1;i<intervals.length;i++){
  const last=res[res.length-1], cur=intervals[i];
  if (cur[0]<=last[1]) last[1]=Math.max(last[1],cur[1]);
  else res.push(cur);
}`,
        variations: [],
        gotchas: ["Skipping the sort step is the #1 mistake here — nothing after it works without sorted intervals."]
      },
      {
        name: "Insert Interval",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/insert-interval/",
        idea: "The list you're given is already sorted and doesn't overlap, so there's no need to re-sort anything. Just go through once in three steps: copy over every interval that ends before the new one starts, then stretch the new interval to cover any interval it overlaps with, then copy over everything that starts after.",
        time: "O(n)", space: "O(n)",
        code: `// 1. push intervals fully before newInterval
// 2. merge all overlapping intervals into newInterval (expand its bounds)
// 3. push newInterval, then push remaining intervals`,
        variations: [],
        gotchas: []
      },
      {
        name: "Non-overlapping Intervals",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/non-overlapping-intervals/",
        idea: "To keep as many non-overlapping intervals as possible, always favor whichever one finishes EARLIEST — finishing early leaves the most room for everything that comes after. That's why this time you sort by END time, not start time. Keep an interval only if it starts at or after the last one you kept ends; otherwise, it has to go.",
        time: "O(n log n)", space: "O(1)",
        code: `intervals.sort((a,b)=>a[1]-b[1]);
let lastEnd=-Infinity, removed=0;
for (const [s,e] of intervals) {
  if (s>=lastEnd) lastEnd=e;
  else removed++;
}`,
        variations: ["Minimum Number of Arrows to Burst Balloons (same shape, different story)"],
        gotchas: ["Sorting by END time instead of start time is the twist here — it's the classic trick question in this category."]
      },
      {
        name: "Meeting Rooms II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/meeting-rooms-ii/",
        idea: "The number of rooms you need at any moment is just the number of meetings happening at the same time. Split all the start times and end times into two separate sorted lists. Walk through both together: every time a meeting starts before the earliest ongoing one ends, you need one more room; every time a meeting ends, you free one up.",
        time: "O(n log n)", space: "O(n)",
        code: `const starts=intervals.map(i=>i[0]).sort((a,b)=>a-b);
const ends=intervals.map(i=>i[1]).sort((a,b)=>a-b);
let rooms=0, maxRooms=0, s=0, e=0;
while (s<starts.length) {
  if (starts[s]<ends[e]) { rooms++; s++; }
  else { rooms--; e++; }
  maxRooms=Math.max(maxRooms, rooms);
}`,
        variations: [],
        gotchas: []
      }
    ]
  },

  {
    id: "matrix",
    name: "Matrix / 2D Array",
    color: "#8a6bf2",
    icon: "matrix",
    trigger: "2D grid input · \"rotate\", \"spiral\", \"set an entire row/column to zero\", \"search a sorted grid\"",
    summary: "Usually about careful index math (rotating, walking in a spiral) or cleverly reusing the grid itself to store extra info without extra memory.",
    problems: [
      {
        name: "Rotate Image",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/rotate-image/",
        idea: "Turning a grid 90 degrees is really just two simple moves in a row: first flip it across its diagonal (rows become columns), then flip each row left-to-right. Doing both directly on the same grid means you don't need a second grid to hold the result.",
        time: "O(n²)", space: "O(1)",
        code: `// transpose
for (let i=0;i<n;i++) for (let j=i+1;j<n;j++) swap(m[i][j], m[j][i]);
// reverse each row
for (let i=0;i<n;i++) m[i].reverse();`,
        variations: [],
        gotchas: ["Flip-then-reverse gives you a clockwise turn; reverse-then-flip gives you counter-clockwise — know which is which."]
      },
      {
        name: "Spiral Matrix",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/spiral-matrix/",
        idea: "Picture peeling the outer layer off a rectangle, over and over. Keep track of your four current edges — top, bottom, left, right. Walk across the top, down the right side, across the bottom, up the left side, then shrink each edge inward and repeat, until there's nothing left to peel.",
        time: "O(m·n)", space: "O(1) extra",
        code: `let top=0,bottom=m-1,left=0,right=n-1;
while (top<=bottom && left<=right) {
  for (let j=left;j<=right;j++) push(mat[top][j]); top++;
  for (let i=top;i<=bottom;i++) push(mat[i][right]); right--;
  if (top<=bottom) { for (let j=right;j>=left;j--) push(mat[bottom][j]); bottom--; }
  if (left<=right) { for (let i=bottom;i>=top;i--) push(mat[i][left]); left++; }
}`,
        variations: ["Spiral Matrix II (build a grid in spiral order instead of reading one)"],
        gotchas: ["The two safety checks before the last two loops stop you from re-visiting the same row/column on non-square grids."]
      },
      {
        name: "Set Matrix Zeroes",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/set-matrix-zeroes/",
        idea: "Instead of building a whole new grid to remember which rows and columns need zeroing, just use the grid's own first row and first column as your notes. Before you start writing notes there, remember whether the actual first row/column originally had a zero in it — otherwise you'll lose that information.",
        time: "O(m·n)", space: "O(1)",
        code: `// use m[i][0] and m[0][j] as markers for row i / col j
// but track separately whether the ORIGINAL first row/col had a zero`,
        variations: [],
        gotchas: ["Check if row 0 or column 0 originally had a zero BEFORE you start using them as your notes — you'll overwrite that info otherwise."]
      },
      {
        name: "Search a 2D Matrix",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/search-a-2d-matrix/",
        idea: "If every row ends smaller than the next row begins, the whole grid is secretly just one long sorted line wearing a 2D costume. So you can binary search it like a normal sorted array — just convert your 'flat' guess position back into a (row, column) using division and remainder.",
        time: "O(log(m·n))", space: "O(1)",
        code: `let l=0, r=m*n-1;
while (l<=r) {
  const mid=(l+r)>>1;
  const val = matrix[Math.floor(mid/n)][mid%n];
  if (val===target) return true;
  val<target ? l=mid+1 : r=mid-1;
}`,
        variations: ["Search a 2D Matrix II (a different grid shape — start from the top-right corner instead)"],
        gotchas: ["This trick only works if every row's last number is smaller than the next row's first number."]
      }
    ]
  },

  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    color: "#5fbf6d",
    icon: "monotonic-stack",
    trigger: "\"Next bigger/smaller number\" · trapping water / biggest rectangle · you need to remember earlier numbers while scanning forward",
    summary: "A stack that's always kept going one direction — always increasing, or always decreasing. Numbers get pushed and popped at most once each, so it stays fast even though it looks like nested loops.",
    problems: [
      {
        name: "Next Greater Element I",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/next-greater-element-i/",
        idea: "The slow way checks every number against every number after it. Instead, keep a stack of numbers that are still 'waiting' to find something bigger than them. When a new, bigger number shows up, it's exactly the answer for everyone smaller still waiting on the stack — pop them off and record the answer, then add the new number to the stack.",
        time: "O(n)", space: "O(n)",
        code: `const stack=[], next={};
for (let i=arr.length-1;i>=0;i--) {
  while (stack.length && stack[stack.length-1]<=arr[i]) stack.pop();
  next[arr[i]] = stack.length ? stack[stack.length-1] : -1;
  stack.push(arr[i]);
}`,
        variations: ["Next Greater Element II (a circular array — just loop through the array twice)", "Daily Temperatures"],
        gotchas: []
      },
      {
        name: "Daily Temperatures",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/daily-temperatures/",
        idea: "You need to know how many days you waited, not just the temperature — so keep positions (indices) on the stack instead of the temperatures themselves. Keep the stack in decreasing order of temperature. When a warmer day shows up, pop off every colder day underneath and record how many days each one waited.",
        time: "O(n)", space: "O(n)",
        code: `const stack=[], res=new Array(arr.length).fill(0);
for (let i=0;i<arr.length;i++) {
  while (stack.length && arr[stack[stack.length-1]]<arr[i]) {
    const j = stack.pop();
    res[j] = i-j;
  }
  stack.push(i);
}`,
        variations: [],
        gotchas: ["Store positions on the stack, not values, any time your answer needs a distance or index."]
      },
      {
        name: "Trapping Rain Water",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/trapping-rain-water/",
        idea: "The water sitting above any bar is limited by whichever is shorter: the tallest wall to its left, or the tallest wall to its right. Keep a stack of bars going from tall to short. When a taller bar finally shows up, it 'closes off' a little basin — pop the shorter bar underneath and work out how much water it could hold, based on the gap width and how tall the new wall is compared to what's still on the stack.",
        time: "O(n)", space: "O(n) (or O(1) with a two-pointer version)",
        code: `const stack=[]; let water=0;
for (let i=0;i<h.length;i++) {
  while (stack.length && h[i]>h[stack[stack.length-1]]) {
    const top = stack.pop();
    if (!stack.length) break;
    const dist = i - stack[stack.length-1] - 1;
    const boundedH = Math.min(h[i], h[stack[stack.length-1]]) - h[top];
    water += dist * boundedH;
  }
  stack.push(i);
}`,
        variations: ["There's also a two-pointer version using left-max/right-max that uses no extra memory — worth learning both."],
        gotchas: []
      },
      {
        name: "Largest Rectangle in Histogram",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        idea: "For every bar, the biggest rectangle you can make using its height is limited by how far you can stretch left and right before hitting something shorter. Keep an increasing stack of bar positions. The moment a shorter bar shows up, every taller bar still on the stack has just found its right-hand limit — pop each one and calculate its rectangle.",
        time: "O(n)", space: "O(n)",
        code: `const stack=[]; let best=0;
for (let i=0;i<=h.length;i++) {
  const cur = i===h.length ? 0 : h[i];
  while (stack.length && h[stack[stack.length-1]]>=cur) {
    const height = h[stack.pop()];
    const width = stack.length ? i-stack[stack.length-1]-1 : i;
    best = Math.max(best, height*width);
  }
  stack.push(i);
}`,
        variations: ["Maximal Rectangle (2D version — run this once per row using column heights)"],
        gotchas: ["Adding a fake bar of height 0 at the very end forces the stack to empty out completely, so nothing gets left unresolved."]
      }
    ]
  },

  {
    id: "greedy",
    name: "Greedy on Arrays",
    color: "#e0973f",
    icon: "greedy",
    trigger: "\"Fewest jumps/steps\" · \"can you reach the end\" · making the best choice right now provably leads to the best overall result",
    summary: "Make the best choice available at each step, and trust that it'll work out — the tricky part is convincing yourself it actually will.",
    problems: [
      {
        name: "Jump Game",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/jump-game/",
        idea: "You don't need to try every possible sequence of jumps. Just keep track of the single farthest spot you could reach so far as you scan left to right. If you ever land on a spot beyond that farthest point, no earlier jump could have gotten you here — you're stuck for good.",
        time: "O(n)", space: "O(1)",
        code: `let farthest=0;
for (let i=0;i<arr.length;i++) {
  if (i>farthest) return false;
  farthest = Math.max(farthest, i+arr[i]);
}
return true;`,
        variations: ["Jump Game II (find the fewest jumps needed, not just whether it's possible)"],
        gotchas: []
      },
      {
        name: "Jump Game II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/jump-game-ii/",
        idea: "Think of it in layers: everything you can reach with your current jump is one layer, and you only take another jump once you've explored everything in the current layer. Track the farthest spot reachable overall, and the edge of your current layer. The moment your scan reaches that edge, you're forced to jump — so count it and extend the layer.",
        time: "O(n)", space: "O(1)",
        code: `let jumps=0, curEnd=0, farthest=0;
for (let i=0;i<arr.length-1;i++) {
  farthest = Math.max(farthest, i+arr[i]);
  if (i===curEnd) { jumps++; curEnd=farthest; }
}`,
        variations: [],
        gotchas: ["Loop up to the second-to-last index — once you've already reached the end, you don't need one more jump."]
      },
      {
        name: "Gas Station",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/gas-station/",
        idea: "First off — a full loop is only possible at all if the total gas is at least the total cost. If that's not true, there's no answer. Otherwise, walk through keeping a running fuel balance from a tentative starting point. The moment it goes negative, that starting point (and everywhere between the old start and here) is proven impossible — so move your tentative start to right after here and reset the balance.",
        time: "O(n)", space: "O(1)",
        code: `let total=0, tank=0, start=0;
for (let i=0;i<gas.length;i++) {
  const diff = gas[i]-cost[i];
  total += diff; tank += diff;
  if (tank<0) { start=i+1; tank=0; }
}
return total>=0 ? start : -1;`,
        variations: [],
        gotchas: ["Understanding WHY failing at one point rules out every start before it is the tricky bit — worth sitting with until it clicks."]
      },
      {
        name: "Candy",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/candy/",
        idea: "There are two rules to satisfy at once: get more candy than your left neighbor if you're rated higher, AND get more candy than your right neighbor if you're rated higher. One single pass can't handle both directions at the same time. So do it in two passes — one left to right for the left rule, one right to left for the right rule — and for each kid, keep whichever amount satisfies both.",
        time: "O(n)", space: "O(n)",
        code: `const candies = new Array(n).fill(1);
for (let i=1;i<n;i++) if (r[i]>r[i-1]) candies[i]=candies[i-1]+1;
for (let i=n-2;i>=0;i--) if (r[i]>r[i+1]) candies[i]=Math.max(candies[i], candies[i+1]+1);`,
        variations: [],
        gotchas: []
      }
    ]
  },

  {
    id: "sorting-tricks",
    name: "Sorting-Based Tricks",
    color: "#6b8ff2",
    icon: "sorting-tricks",
    trigger: "The answer becomes obvious once the array is sorted, even if the question didn't explicitly ask you to sort",
    summary: "Sometimes the whole trick is just: sort it first. Once it's sorted, a simple scan or two-pointer sweep finishes the job.",
    problems: [
      {
        name: "Merge Sorted Array",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/merge-sorted-array/",
        idea: "Merging from the front would overwrite numbers you still need to compare later. The fix: merge from the BACK instead. Compare the largest remaining number in each array, and place the bigger one at the very end of the free space — working backward means you only ever write into spots that are already used up.",
        time: "O(m+n)", space: "O(1)",
        code: `let i=m-1, j=n-1, k=m+n-1;
while (j>=0) {
  nums1[k--] = (i>=0 && nums1[i]>nums2[j]) ? nums1[i--] : nums2[j--];
}`,
        variations: [],
        gotchas: ["Merging from the back is the whole trick — merging from the front needs extra space to avoid overwriting things."]
      },
      {
        name: "Meeting Rooms (can you attend all of them?)",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/meeting-rooms/",
        idea: "Once you sort the meetings by start time, spotting a conflict is easy — a conflict can only happen between two meetings that are next to each other in that order. So sort first, then just compare each meeting's start time to the one right before it.",
        time: "O(n log n)", space: "O(1)",
        code: `intervals.sort((a,b)=>a[0]-b[0]);
for (let i=1;i<intervals.length;i++)
  if (intervals[i][0] < intervals[i-1][1]) return false;
return true;`,
        variations: [],
        gotchas: []
      },
      {
        name: "Kth Largest Element in an Array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        idea: "Fully sorting the array does more work than you actually need, since you only care about one position. Quickselect is smarter: it partitions like quicksort does, but only keeps digging into whichever side actually contains the answer, throwing away the other side completely. A heap of size k is another good option, especially if numbers are arriving one at a time.",
        time: "O(n log n) if you sort, or O(n) on average with quickselect", space: "O(1) to O(k)",
        code: `// Quickselect: partition like quicksort, but only recurse into
// the side that contains the k-th index — discard the other half.`,
        variations: ["Top K Frequent Elements (bucket sort by frequency runs in O(n))"],
        gotchas: ["Being able to explain all three options (sort / heap / quickselect) and their trade-offs is usually what interviewers want."]
      }
    ]
  },

  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    color: "#b06bf2",
    icon: "bit-manipulation",
    trigger: "\"Find the one number that's different\" · needs zero extra memory and numbers come in pairs · anything about powers of two",
    summary: "XOR cancels out matching pairs of numbers, and a few small bit tricks can isolate exactly the bit you need — handy whenever a hashmap works but the question wants zero extra memory.",
    problems: [
      {
        name: "Single Number",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/single-number/",
        idea: "XOR has a neat property: any number XORed with itself becomes 0, and the order you XOR things in doesn't matter. So if every number except one shows up exactly twice, XORing the whole array together cancels out every pair, leaving only the lonely number standing.",
        time: "O(n)", space: "O(1)",
        code: `let res=0;
for (const x of arr) res ^= x;
return res;`,
        variations: ["Single Number II (everything else appears 3 times — needs counting bits at each position)", "Single Number III (two unique numbers instead of one)"],
        gotchas: []
      },
      {
        name: "Single Number III",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/single-number-iii/",
        idea: "With two unique numbers instead of one, XORing everything gives you (a XOR b), not either number by itself. But that result still tells you something: any bit that's turned on in it must be different between a and b. Pick one such bit, and use it to split the whole array into two groups — a and b are guaranteed to land in different groups. XOR each group on its own to get each number.",
        time: "O(n)", space: "O(1)",
        code: `let xorAll=0;
for (const x of arr) xorAll ^= x;
const diffBit = xorAll & (-xorAll); // lowest set bit
let a=0;
for (const x of arr) if (x & diffBit) a ^= x;
const b = xorAll ^ a;`,
        variations: [],
        gotchas: ["`x & (-x)` is a handy trick that isolates the lowest 'on' bit of a number — it shows up in a lot of bit problems."]
      },
      {
        name: "Counting Bits",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/counting-bits/",
        idea: "Instead of counting the bits of every number from scratch, notice that any number is just a smaller number (itself shifted right by one) with one extra bit tacked on. So its bit count is: the bit count of that smaller number, plus 1 if the original number is odd. You can build the whole answer list using answers you already calculated.",
        time: "O(n)", space: "O(n)",
        code: `const res = new Array(n+1).fill(0);
for (let i=1;i<=n;i++) res[i] = res[i>>1] + (i&1);`,
        variations: [],
        gotchas: []
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Sorted array + finding a pair", pattern: "two-pointers" },
  { keyword: "Contiguous stretch of numbers, with some limit or rule", pattern: "sliding-window" },
  { keyword: "Asked the sum of a range, over and over", pattern: "prefix-sum" },
  { keyword: "\"Subarray sum equals k\"", pattern: "prefix-sum" },
  { keyword: "Max or min sum of a contiguous stretch", pattern: "kadane" },
  { keyword: "Sorted or rotated-sorted array — search it fast", pattern: "binary-search" },
  { keyword: "\"Find the smallest/largest value that still works\"", pattern: "binary-search" },
  { keyword: "\"Have I seen this number before?\"", pattern: "hashing" },
  { keyword: "Numbers limited to a known range, find missing/duplicate", pattern: "cyclic-sort" },
  { keyword: "Array of [start, end] pairs", pattern: "merge-intervals" },
  { keyword: "2D grid — rotate, spiral, or zero out rows/columns", pattern: "matrix" },
  { keyword: "\"Next bigger/smaller number\"", pattern: "monotonic-stack" },
  { keyword: "\"Fewest jumps\" or \"can you reach the end\"", pattern: "greedy" },
  { keyword: "Sorting it first makes everything easy", pattern: "sorting-tricks" },
  { keyword: "\"Find the one number that's different\", no extra memory", pattern: "bit-manipulation" }
];