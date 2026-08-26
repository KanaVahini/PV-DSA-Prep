// ============================================================
// DSA Recursion — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["recursion"] so
// multiple topic files can coexist without clashing on names.
//
// Grouped by the shape of the recursion itself (divide-and-conquer,
// pick/don't-pick, start-index combination loops, sequence building,
// partitioning, grid DFS, constraint placement) rather than by
// source difficulty label — so problems that share a skeleton sit
// together and revise as a set.
// ============================================================
(function () {

const TOPIC = {
  id: "recursion",
  title: "Recursion",
  tagline: "A function that trusts itself to solve the smaller version of the problem. Almost every problem here reduces to one of a handful of recursive skeletons — learn the skeleton once, recognize it everywhere."
};

const PATTERNS = [
  {
    id: "recursion-divide-conquer",
    name: "Divide & Conquer — Halve the Work Each Call",
    color: "#38bdf8",
    icon: "recursion-divide-conquer",
    trigger: "The problem on size n can be answered from the answer on size n/2, with a tiny bit of extra work stitched on top",
    summary: "The smallest recursive idea there is: don't repeat work n times, split it in half and reuse one half's answer for the other. It shows up constantly in disguise — this is the same halving instinct behind merge sort and binary search.",
    problems: [
      {
        name: "Pow(x,n)",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/powx-n/",
        idea: "Multiplying x by itself n times naively is O(n). Halve the exponent every call instead: x^n = (x^(n/2))^2, with one extra factor of x tacked on when n is odd. That turns a linear number of multiplications into a logarithmic one. Negative exponents are handled by inverting x and flipping n positive before recursing.",
        time: "O(log n)", space: "O(log n) recursion stack",
        code: `double fastPow(double x, long long n) {
    if (n == 0) return 1.0;
    double half = fastPow(x, n / 2);
    double result = half * half;
    if (n % 2 != 0) result *= x;
    return result;
}

double myPow(double x, int n) {
    long long N = n;
    if (N < 0) { x = 1 / x; N = -N; }
    return fastPow(x, N);
}`,
        variations: ["Iterative fast exponentiation (same halving idea, but with a loop instead of a call stack)", "Modular exponentiation — take a mod after every multiplication, common in competitive programming"],
        gotchas: ["`n` can be `INT_MIN`, and negating that overflows a 32-bit int — widen to `long long` before flipping its sign.", "Storing `half` once and squaring it matters — calling `fastPow(x, n/2)` twice instead doubles the work and quietly turns O(log n) back into O(n)."]
      }
    ]
  },

  {
    id: "recursion-pick-notpick",
    name: "Pick / Don't-Pick — Binary Choice at Every Index",
    color: "#4fd1c5",
    icon: "recursion-pick-notpick",
    trigger: "Deciding, for every single element, whether it belongs in the answer — the recursion tree has exactly two branches at every index",
    summary: "The core subsequence skeleton: at index i, either include arr[i] and move to i+1, or skip it and move to i+1. That one choice, repeated across every index, explores all 2^n subsequences. What differs between these three problems is only what happens at the base case — collect everything, return true/false the instant a match is found, or add up counts from both branches.",
    problems: [
      {
        name: "Power Set",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/power-set/",
        idea: "The textbook version of pick/don't-pick: at every index, recurse once having pushed the element (pick) and once without pushing it (don't pick). Collect `cur` into the result only once the index runs off the end. Every one of the 2^n leaves of this recursion tree is a distinct subsequence, including the empty one.",
        time: "O(2^n * n) — 2^n subsequences, each up to length n to copy out", space: "O(n) recursion depth",
        code: `void solve(int idx, vector<int>& nums, vector<int>& cur, vector<vector<int>>& res) {
    if (idx == (int)nums.size()) { res.push_back(cur); return; }
    // pick nums[idx]
    cur.push_back(nums[idx]);
    solve(idx + 1, nums, cur, res);
    cur.pop_back();
    // don't pick nums[idx]
    solve(idx + 1, nums, cur, res);
}

vector<vector<int>> powerSet(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> cur;
    solve(0, nums, cur, res);
    return res;
}`,
        variations: ["Generate the power set iteratively with bitmasking — each number from 0 to 2^n - 1 encodes one subsequence in its bits.", "Subsets I in the next group below builds the exact same 2^n subsequences with a start-index loop instead of an explicit pick/don't-pick pair — same tree, different code shape."],
        gotchas: ["Push a COPY of `cur` into the result, not a reference to it — `cur` keeps mutating afterward, so every stored entry would otherwise end up pointing at the same, eventually-empty vector."]
      },
      {
        name: "Check if there exists a subsequence with sum K",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/check-if-there-exists-a-subsequence-with-sum-k/",
        idea: "Same pick/don't-pick recursion as Power Set, but the base case answers a yes/no question instead of collecting output: return true the instant `target` hits 0. Because this only needs ONE success, `||` between the two branches short-circuits and stops exploring as soon as any branch succeeds — a search for existence gets to quit early, unlike full enumeration.",
        time: "O(2^n) worst case (no matching subsequence exists), but exits the instant a match is found", space: "O(n) recursion depth",
        code: `bool solve(int idx, int target, vector<int>& arr) {
    if (target == 0) return true;
    if (idx == (int)arr.size() || target < 0) return false;
    // pick arr[idx], or skip it
    return solve(idx + 1, target - arr[idx], arr) || solve(idx + 1, target, arr);
}

bool subsequenceSumK(vector<int>& arr, int k) {
    return solve(0, k, arr);
}`,
        variations: ["Return the actual subsequence instead of just true/false (carry the chosen elements alongside the recursion).", "All elements are positive here, which is what makes the `target < 0` prune safe — with negative elements allowed, that prune stops being valid."],
        gotchas: ["Check `target == 0` before checking `idx == n` — a target that hits exactly 0 right as the array runs out must still count as a success, not a failure."]
      },
      {
        name: "Count all subsequences with sum K",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/count-subsequences-with-sum-k/",
        idea: "The same pick/don't-pick recursion one more time, but now the base case can't stop early — it needs every branch's contribution. Add the counts returned by BOTH branches (pick and don't-pick) at every step instead of using `||`, so every valid subsequence gets counted exactly once by the time the recursion bottoms out.",
        time: "O(2^n)", space: "O(n) recursion depth",
        code: `int solve(int idx, int target, vector<int>& arr) {
    if (idx == (int)arr.size()) return target == 0 ? 1 : 0;
    int pick = (target - arr[idx] >= 0) ? solve(idx + 1, target - arr[idx], arr) : 0;
    int notPick = solve(idx + 1, target, arr);
    return pick + notPick;
}

int countSubsequencesWithSumK(vector<int>& arr, int k) {
    return solve(0, k, arr);
}`,
        variations: ["If the array can contain negative numbers, the `target - arr[idx] >= 0` prune no longer applies, and memoization (DP) is needed to stay efficient.", "When all elements are positive, this exact recursion is the brute-force version of the 'count subsets with a given sum' DP, solvable in O(n * k) with a 2D table."],
        gotchas: ["This is the textbook case where naive recursion blows up exponentially even though the answer only depends on (index, remaining target) — recognizing that overlap is the cue to memoize.", "Swapping `+` for `||` (like the existence check above) would silently turn this back into a yes/no check — the operator between the two branches is what distinguishes 'exists' from 'count'."]
      }
    ]
  },

  {
    id: "recursion-build-sequence",
    name: "Build the Answer One Choice at a Time",
    color: "#fbbf24",
    icon: "recursion-build-sequence",
    trigger: "Constructing a string or sequence position by position, where each position offers a small menu of legal next moves",
    summary: "Instead of deciding 'in or out' for existing elements, these recursions grow the answer from nothing — appending one character, trying every option that's legal right now, recursing, then undoing it to try the next option. The menu of choices can be fixed (a keypad mapping) or state-dependent (how many brackets are still available).",
    problems: [
      {
        name: "Generate Parentheses",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/generate-parentheses/",
        idea: "Build the string one character at a time, and only ever branch into a choice that keeps it valid: add an open bracket whenever opens are still available, and a close bracket only when more opens have been placed than closes so far (otherwise it would close something that doesn't exist yet). Recursion explores every legal ordering this way without ever needing to backtrack out of an invalid state, since invalid states are never entered.",
        time: "O(4^n / sqrt(n)) — the nth Catalan number, times O(n) to copy each finished string", space: "O(n) recursion depth",
        code: `void solve(int open, int close, int n, string &cur, vector<string> &res) {
    if ((int)cur.size() == 2 * n) { res.push_back(cur); return; }
    if (open < n) { cur.push_back('('); solve(open + 1, close, n, cur, res); cur.pop_back(); }
    if (close < open) { cur.push_back(')'); solve(open, close + 1, n, cur, res); cur.pop_back(); }
}

vector<string> generateParenthesis(int n) {
    vector<string> res;
    string cur;
    solve(0, 0, n, cur, res);
    return res;
}`,
        variations: ["Count only how many valid combinations exist, without generating them — it's just the nth Catalan number."],
        gotchas: ["The `close < open` guard is what keeps every generated string balanced — drop it and the recursion happily produces invalid strings like ')('.", "Building/undoing `cur` in place (push then pop) avoids copying a new string at every call; passing a fresh string by value at each step works too, just wastefully."]
      },
      {
        name: "Letter Combinations of a Phone Number",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
        idea: "The same 'build one character, try every legal option, undo, try the next' skeleton as Generate Parentheses — but here the menu of legal next characters is fixed per position (whatever letters the current digit maps to) instead of depending on running state. For the current digit, try every letter it could represent, recurse into the next digit, then undo and try the next letter.",
        time: "O(4^n * n) — up to 4 letters per digit (7 and 9), times O(n) to copy each finished string", space: "O(n) recursion depth",
        code: `void solve(int idx, string& digits, vector<string>& mapping, string& cur, vector<string>& res) {
    if (idx == (int)digits.size()) { if (!cur.empty()) res.push_back(cur); return; }
    string letters = mapping[digits[idx] - '0'];
    for (char c : letters) {
        cur.push_back(c);
        solve(idx + 1, digits, mapping, cur, res);
        cur.pop_back();
    }
}

vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    vector<string> mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    vector<string> res;
    string cur;
    solve(0, digits, mapping, cur, res);
    return res;
}`,
        variations: ["The same idea generalized to any fixed digit-to-characters mapping, not just a phone keypad."],
        gotchas: ["Handle an empty input string as a special case up front — without it, the recursion returns one empty combination instead of correctly returning zero combinations."]
      }
    ]
  },

  {
    id: "recursion-combos-start-index",
    name: "Combinations & Subsets via a Start-Index Loop",
    color: "#a78bfa",
    icon: "recursion-combos-start-index",
    trigger: "Building every subset or combination that fits a rule — reuse allowed or not, duplicates in the input or not, a fixed size or not",
    summary: "One shared skeleton underneath five different-looking LeetCode problems: at each call, loop over every candidate from a 'start' position onward, take it, recurse, then undo. The five problems below are really the same loop with one knob each turned differently — whether taking an element lets you take it again, whether the input has duplicates you must skip, and whether there's a target sum or a fixed count. Once you see the shared shape, all five stop looking like separate problems.",
    problems: [
      {
        name: "Subsets I",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/subsets/",
        idea: "The baseline version of the loop: no target sum, no reuse, no duplicates to worry about. Add the current subset to the result the moment each call starts — not only at the end — since every partial set of choices made so far is itself a valid subset. Then loop from the current start index onward, taking each candidate once and recursing with `i + 1`.",
        time: "O(2^n * n)", space: "O(n) recursion depth",
        code: `void solve(int idx, vector<int>& nums, vector<int>& cur, vector<vector<int>>& res) {
    res.push_back(cur); // every partial state is a valid subset
    for (int i = idx; i < (int)nums.size(); i++) {
        cur.push_back(nums[i]);
        solve(i + 1, nums, cur, res);
        cur.pop_back();
    }
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> cur;
    solve(0, nums, cur, res);
    return res;
}`,
        variations: ["Power Set, in the group above, builds the exact same 2^n subsets with explicit pick/don't-pick branching instead of a loop — same recursion tree, different code shape.", "Subsets II just below adds duplicate-skipping on top of this exact loop."],
        gotchas: ["This loop-based recursion and Power Set's pick/don't-pick recursion generate the same 2^n subsets, just in a different order — neither is more 'correct' than the other."]
      },
      {
        name: "Subsets II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/subsets-ii/",
        idea: "Turn the reuse knob off (already off in Subsets I) and turn the duplicates knob on: sort first so equal values sit next to each other, then inside the loop skip any candidate identical to the one immediately before it — unless it's the first candidate considered at that particular recursion level. That one `if` is the entire difference from Subsets I.",
        time: "O(2^n * n)", space: "O(n) recursion depth",
        code: `void solve(int idx, vector<int>& nums, vector<int>& cur, vector<vector<int>>& res) {
    res.push_back(cur);
    for (int i = idx; i < (int)nums.size(); i++) {
        if (i > idx && nums[i] == nums[i - 1]) continue; // skip duplicates at this level
        cur.push_back(nums[i]);
        solve(i + 1, nums, cur, res);
        cur.pop_back();
    }
}

vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    vector<int> cur;
    solve(0, nums, cur, res);
    return res;
}`,
        variations: ["Subsets I above (identical loop, no duplicates to worry about).", "Combination Sum II below applies this exact same duplicate-skip line to a target-sum version of the loop instead of a plain subset version."],
        gotchas: ["Sorting isn't optional here — without it, equal values won't be adjacent and the duplicate check silently stops catching anything.", "The check is `i > idx`, not `i > 0` — it skips duplicates only at the SAME recursion level; a repeated value can still appear once per level, just never twice from the same starting position."]
      },
      {
        name: "Combination Sum",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/combination-sum/",
        idea: "Turn the reuse knob ON: the same number can be picked any number of times. This is written as a binary pick/don't-pick pair rather than a for-loop, but it's the same family — 'take candidates[idx] again' recurses while STAYING at idx (since reuse is allowed), and 'move on' advances to idx + 1 for good. Subtract the chosen number from the remaining target each time it's taken, and stop a branch the moment the target hits 0 (success) or drops below 0 (failure).",
        time: "Exponential in the worst case — bounded by how many ways the target can be reached", space: "O(target / smallest candidate) recursion depth",
        code: `void solve(int idx, vector<int>& candidates, int target, vector<int>& cur, vector<vector<int>>& res) {
    if (target == 0) { res.push_back(cur); return; }
    if (idx == (int)candidates.size() || target < 0) return;
    // take candidates[idx] again — stay at idx, since reuse is allowed
    cur.push_back(candidates[idx]);
    solve(idx, candidates, target - candidates[idx], cur, res);
    cur.pop_back();
    // move on without taking it again
    solve(idx + 1, candidates, target, cur, res);
}

vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    vector<vector<int>> res;
    vector<int> cur;
    solve(0, candidates, target, cur, res);
    return res;
}`,
        variations: ["Combination Sum II just below turns reuse back off and adds duplicate-skipping instead.", "Rewriting this with a `for` loop from `idx` (instead of the binary pair) produces the identical result set — useful to see both code shapes map to the same idea."],
        gotchas: ["The 'take again' call passes `idx`, not `idx + 1` — that single detail is what allows reuse; getting it wrong silently turns this into a no-reuse combination search."]
      },
      {
        name: "Combination Sum II",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/combination-sum-ii/",
        idea: "Turn the reuse knob back OFF and the duplicates knob ON: each number usable once, input may contain duplicates. This is exactly the Subsets II loop with a target-sum base case swapped in — sort first, skip a candidate identical to the one before it at the same level, and additionally break out of the loop once a sorted candidate exceeds the remaining target (nothing further in a sorted list could work either).",
        time: "O(2^n) worst case", space: "O(n) recursion depth",
        code: `void solve(int idx, vector<int>& candidates, int target, vector<int>& cur, vector<vector<int>>& res) {
    if (target == 0) { res.push_back(cur); return; }
    for (int i = idx; i < (int)candidates.size(); i++) {
        if (i > idx && candidates[i] == candidates[i - 1]) continue; // skip duplicates at this level
        if (candidates[i] > target) break; // sorted, so nothing further can work either
        cur.push_back(candidates[i]);
        solve(i + 1, candidates, target - candidates[i], cur, res);
        cur.pop_back();
    }
}

vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> res;
    vector<int> cur;
    solve(0, candidates, target, cur, res);
    return res;
}`,
        variations: ["Combination Sum above (reuse turned on, no duplicates to worry about).", "Subsets II above (identical duplicate-skip loop, no target sum to hit)."],
        gotchas: ["Skipping the sort breaks both the duplicate-skip logic and the `break` pruning, since neither works correctly on unsorted input."]
      },
      {
        name: "Combination Sum III",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/combination-sum-iii/",
        idea: "Turn on a third knob instead: a fixed COUNT constraint. Use exactly k numbers, each digit 1–9 used at most once, summing to target n. No sorting or duplicate-skipping is needed since 1-9 are already unique — the loop is Subsets I's plain no-reuse loop, plus one extra stopping condition on how many numbers have been picked so far.",
        time: "O(C(9, k)) worst case — small, since digits are capped at 9", space: "O(k) recursion depth",
        code: `void solve(int start, int k, int target, vector<int>& cur, vector<vector<int>>& res) {
    if ((int)cur.size() == k) { if (target == 0) res.push_back(cur); return; }
    for (int d = start; d <= 9; d++) {
        if (d > target) break; // digits only grow from here, so no point continuing
        cur.push_back(d);
        solve(d + 1, k, target - d, cur, res);
        cur.pop_back();
    }
}

vector<vector<int>> combinationSum3(int k, int n) {
    vector<vector<int>> res;
    vector<int> cur;
    solve(1, k, n, cur, res);
    return res;
}`,
        variations: ["Combination Sum above (numbers can repeat, no fixed count constraint)."],
        gotchas: ["Checking `cur.size() == k` before checking `target == 0` matters — a combination that happens to hit the target early but hasn't used exactly k digits yet is not a valid answer, no matter what the sum says."]
      }
    ]
  },

  {
    id: "recursion-partition",
    name: "Partition / Cut-Point Backtracking",
    color: "#f472b6",
    icon: "recursion-partition",
    trigger: "Splitting a sequence into pieces that each satisfy some rule, where a piece's length isn't fixed in advance",
    summary: "A different kind of loop from the combination one above: instead of looping over which elements to include, this loops over WHERE the next cut goes. From the current start, try every possible end point for the next piece, and only recurse into the remainder if that piece is valid.",
    problems: [
      {
        name: "Palindrome partitioning",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/palindrome-partitioning/",
        idea: "Every way to split a string into palindromic pieces is a sequence of choices: 'where does the next piece end?'. From each starting index, try every possible end point for the next piece, and only recurse further if that piece is itself a palindrome — this backtracks through every valid partition without ever building an invalid one.",
        time: "O(2^n * n) worst case — e.g. a string like 'aaaa' where every substring is a palindrome", space: "O(n) recursion depth",
        code: `bool isPalindrome(const string& s, int l, int r) {
    while (l < r) { if (s[l++] != s[r--]) return false; }
    return true;
}

void solve(int idx, string& s, vector<string>& cur, vector<vector<string>>& res) {
    if (idx == (int)s.size()) { res.push_back(cur); return; }
    for (int end = idx; end < (int)s.size(); end++) {
        if (isPalindrome(s, idx, end)) {
            cur.push_back(s.substr(idx, end - idx + 1));
            solve(end + 1, s, cur, res);
            cur.pop_back();
        }
    }
}

vector<vector<string>> partition(string s) {
    vector<vector<string>> res;
    vector<string> cur;
    solve(0, s, cur, res);
    return res;
}`,
        variations: ["Palindrome Partitioning II — the minimum number of cuts instead of every partition, which usually needs DP since brute-force recursion is too slow for it."],
        gotchas: ["Re-checking `isPalindrome` from scratch for every substring does repeated work — precomputing a 2D 'is s[i..j] a palindrome' table up front turns each check into O(1)."]
      }
    ]
  },

  {
    id: "recursion-grid-dfs",
    name: "Grid DFS — Mark, Explore, Unmark",
    color: "#fc8181",
    icon: "recursion-grid-dfs",
    trigger: "Searching for a path through a 2D grid, one step at a time, where a cell can't be reused within the same path",
    summary: "Both problems here share the exact same four lines of logic: check bounds and validity, mark the current cell visited, recursively try every neighboring direction, then unmark the cell before returning — so a dead-end path never blocks a different path from later reusing that same cell.",
    problems: [
      {
        name: "Word Search",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/word-search/",
        idea: "Try starting the word from every cell in the grid. From a starting cell, recursively check all four neighbors for the next character in the word, marking the current cell visited before recursing and un-marking it right after — so a given path never reuses a cell, but a different path is still free to use it.",
        time: "O(rows * cols * 4^L) where L is the word length", space: "O(L) recursion depth",
        code: `bool solve(vector<vector<char>>& board, string& word, int r, int c, int idx) {
    if (idx == (int)word.size()) return true;
    if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size() || board[r][c] != word[idx]) return false;
    char temp = board[r][c];
    board[r][c] = '#'; // mark visited
    bool found = solve(board, word, r + 1, c, idx + 1) ||
                 solve(board, word, r - 1, c, idx + 1) ||
                 solve(board, word, r, c + 1, idx + 1) ||
                 solve(board, word, r, c - 1, idx + 1);
    board[r][c] = temp; // unmark on the way back out
    return found;
}

bool exist(vector<vector<char>>& board, string word) {
    for (int r = 0; r < (int)board.size(); r++)
        for (int c = 0; c < (int)board[0].size(); c++)
            if (solve(board, word, r, c, 0)) return true;
    return false;
}`,
        variations: ["Word Search II — search for many words against the same board at once; building a Trie from all target words avoids repeating this search per word.", "Rat in a Maze just below is the same mark/explore/unmark skeleton, but collecting every path instead of stopping at the first match."],
        gotchas: ["`board[r][c] = temp` must run on EVERY exit path, including the ones where `found` is false — returning early without restoring first corrupts the board for the next starting cell's search."]
      },
      {
        name: "Rat in a Maze",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/rat-in-a-maze/",
        idea: "The same mark/explore/unmark grid DFS as Word Search, but collecting every complete path instead of returning as soon as one is found. From the current cell, try moving in each allowed direction (commonly down, left, right, up, for lexicographically ordered output). A move is valid only if it stays in bounds, lands on an open cell, and hasn't already been visited on this path.",
        time: "O(4^(n*n)) worst case, heavily pruned in practice by the visited and boundary checks", space: "O(n*n) for the visited grid plus recursion depth",
        code: `void solve(int r, int c, vector<vector<int>>& maze, int n, vector<vector<bool>>& visited, string path, vector<string>& res) {
    if (r == n - 1 && c == n - 1) { res.push_back(path); return; }
    int dr[] = {1, 0, 0, -1}, dc[] = {0, -1, 1, 0};
    char dirName[] = {'D', 'L', 'R', 'U'};
    for (int i = 0; i < 4; i++) {
        int nr = r + dr[i], nc = c + dc[i];
        if (nr >= 0 && nc >= 0 && nr < n && nc < n && maze[nr][nc] == 1 && !visited[nr][nc]) {
            visited[nr][nc] = true;
            solve(nr, nc, maze, n, visited, path + dirName[i], res);
            visited[nr][nc] = false;
        }
    }
}

vector<string> ratInMaze(vector<vector<int>>& maze, int n) {
    vector<string> res;
    if (maze[0][0] == 0) return res;
    vector<vector<bool>> visited(n, vector<bool>(n, false));
    visited[0][0] = true;
    solve(0, 0, maze, n, visited, "", res);
    return res;
}`,
        variations: ["Allow diagonal moves too (8 directions instead of 4).", "Find only the shortest path instead of every path — BFS is the better tool for that, not backtracking."],
        gotchas: ["The direction order (D, L, R, U here) decides what ORDER the paths appear in the output, not just which paths exist — match whatever order a grader expects if it wants lexicographically sorted output."]
      }
    ]
  },

  {
    id: "recursion-constraint-placement",
    name: "Constraint Placement Backtracking",
    color: "#34d399",
    icon: "recursion-constraint-placement",
    trigger: "Filling in positions one at a time (a row, a vertex, a grid cell) where each placement must stay consistent with everything placed so far",
    summary: "The most 'classic backtracking' shape of all: move to the next position, try every candidate value there, accept it only if it doesn't conflict with earlier placements, recurse — and if every candidate fails, backtrack and let an earlier position try something else. All three problems here are this same place → check → recurse → undo loop, just checking a different kind of conflict.",
    problems: [
      {
        name: "N Queen",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/n-queens/",
        idea: "Place queens one row at a time. For each row, try every column; a placement is safe only if no earlier queen shares its column or lies on the same diagonal (row - col or row + col matches an existing queen). Tracking 'used' columns and diagonals in simple boolean arrays makes each safety check O(1) instead of rescanning the whole board.",
        time: "Roughly O(N!), heavily pruned by the safety checks", space: "O(N) for the tracking arrays and recursion depth",
        code: `void solve(int row, int n, vector<string>& board, vector<bool>& cols, vector<bool>& diag1, vector<bool>& diag2, vector<vector<string>>& res) {
    if (row == n) { res.push_back(board); return; }
    for (int col = 0; col < n; col++) {
        int d1 = row - col + n, d2 = row + col; // shift d1 so it's never negative
        if (cols[col] || diag1[d1] || diag2[d2]) continue;
        board[row][col] = 'Q';
        cols[col] = diag1[d1] = diag2[d2] = true;
        solve(row + 1, n, board, cols, diag1, diag2, res);
        board[row][col] = '.';
        cols[col] = diag1[d1] = diag2[d2] = false;
    }
}

vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> res;
    vector<string> board(n, string(n, '.'));
    vector<bool> cols(n, false), diag1(2 * n, false), diag2(2 * n, false);
    solve(0, n, board, cols, diag1, diag2, res);
    return res;
}`,
        variations: ["N Queens II — just count the number of solutions, without building or storing the boards themselves.", "M Coloring below is the same place/check/recurse/undo loop, checking graph-neighbor conflicts instead of row/column/diagonal conflicts."],
        gotchas: ["Diagonal indices (`row - col`) can go negative — shift by `+ n` before indexing into the boolean array, or use a hash set instead."]
      },
      {
        name: "M Coloring Problem",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/m-coloring-problem/",
        idea: "The same placement loop as N-Queens, moved from a chessboard to a graph: color vertices one at a time. For the current vertex, try every one of the m colors; a color is safe if none of its already-colored neighbors use it. If a color works, move on to the next vertex; if every color fails, backtrack and let an earlier vertex try something else.",
        time: "O(m^V) worst case, heavily pruned in practice", space: "O(V) recursion depth",
        code: `bool isSafe(int node, int color, vector<vector<int>>& adjMatrix, vector<int>& colors, int v) {
    for (int k = 0; k < v; k++)
        if (adjMatrix[node][k] && colors[k] == color) return false;
    return true;
}

bool solve(int node, vector<vector<int>>& adjMatrix, vector<int>& colors, int m, int v) {
    if (node == v) return true;
    for (int c = 1; c <= m; c++) {
        if (isSafe(node, c, adjMatrix, colors, v)) {
            colors[node] = c;
            if (solve(node + 1, adjMatrix, colors, m, v)) return true;
            colors[node] = 0; // backtrack
        }
    }
    return false;
}

bool graphColoring(vector<vector<int>>& adjMatrix, int m, int v) {
    vector<int> colors(v, 0);
    return solve(0, adjMatrix, colors, m, v);
}`,
        variations: ["Find the actual minimum number of colors needed (the chromatic number) instead of checking a fixed m.", "Return one valid coloring assignment instead of just true/false."],
        gotchas: ["`isSafe` rescans every vertex's row of the adjacency matrix on every attempt — for dense graphs, keeping a per-vertex set of colors already used by neighbors avoids the repeated scan."]
      },
      {
        name: "Sudoku Solver",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/sudoku-solver/",
        idea: "The same placement loop again, now checking THREE overlapping constraints at once instead of one. Find the next empty cell; try digits 1-9 in it, keeping only ones that don't already appear in the same row, column, or 3x3 box. Recurse into the rest of the board with that digit placed — if every downstream cell eventually fills in successfully, the puzzle is solved; otherwise undo and try the next digit.",
        time: "O(9^(empty cells)) worst case, heavily pruned by the constraint checks", space: "O(1) extra beyond the board (mutated in place) plus recursion depth",
        code: `bool isValid(vector<vector<char>>& board, int row, int col, char c) {
    for (int i = 0; i < 9; i++) {
        if (board[row][i] == c) return false;
        if (board[i][col] == c) return false;
        if (board[3 * (row / 3) + i / 3][3 * (col / 3) + i % 3] == c) return false;
    }
    return true;
}

bool solve(vector<vector<char>>& board) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] == '.') {
                for (char c = '1'; c <= '9'; c++) {
                    if (isValid(board, row, col, c)) {
                        board[row][col] = c;
                        if (solve(board)) return true;
                        board[row][col] = '.'; // backtrack
                    }
                }
                return false; // no digit works here — dead end
            }
        }
    }
    return true; // no empty cells left
}

void solveSudoku(vector<vector<char>>& board) {
    solve(board);
}`,
        variations: ["Validate whether an already-completed board is a valid solution — no recursion needed, just the same row/column/box checks run once.", "Sudoku variants with a different box size (e.g. 16x16 with 4x4 boxes) — same idea, adjusted constants."],
        gotchas: ["The `return false` inside the innermost loop, for when NO digit works in a cell, is what actually triggers backtracking in the caller — skip it and the function falls through and wrongly reports success."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Answer on size n from the answer on size n/2", pattern: "recursion-divide-conquer" },
  { keyword: "Include or skip this element, then move to the next index", pattern: "recursion-pick-notpick" },
  { keyword: "Grow a string/sequence one legal character at a time", pattern: "recursion-build-sequence" },
  { keyword: "Loop over a start index to build subsets/combinations", pattern: "recursion-combos-start-index" },
  { keyword: "Where does the next piece end — splitting into valid chunks", pattern: "recursion-partition" },
  { keyword: "DFS through a grid, marking and unmarking visited cells", pattern: "recursion-grid-dfs" },
  { keyword: "Place one item at a time, checked against everything placed so far", pattern: "recursion-constraint-placement" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.recursion = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();