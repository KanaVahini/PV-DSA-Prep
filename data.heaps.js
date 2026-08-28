// ============================================================
// DSA Heaps — Pattern Data
// Registers itself into window.TOPIC_REGISTRY["heaps"] so
// multiple topic files can coexist without clashing on names.
//
// Grouped by the shape of the heap technique itself (the core
// sift-down building block, insert/extract mechanics, bounded
// top-k heaps, and advanced multi-structure applications)
// rather than by source theory/FAQ label — so problems that
// share a skeleton sit together and revise as a set.
// ============================================================
(function () {

const TOPIC = {
  id: "heaps",
  title: "Heaps",
  tagline: "Almost everything here reduces to one operation — sift a misplaced element down (or up) until the heap property holds again. Insert, extract, build, sort, and top-k are all just that one move, reused."
};

const PATTERNS = [
  {
    id: "heap-core-mechanics",
    name: "Core Heap Operations",
    color: "#38bdf8",
    icon: "heap-core-mechanics",
    trigger: "Turning a plain array into a heap, checking whether it already is one, or using that same building block to sort in place",
    summary: "One subroutine — heapify (sift a node down until it's no longer worse than its children) — powers all four of these. Building a heap from scratch is just calling heapify bottom-up; heap sort is that same build step, plus repeatedly pulling the root out and heapifying what's left.",
    problems: [
      {
        name: "Heapify Algorithm",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/building-heap-from-array/",
        idea: "Heapify assumes the two subtrees rooted at a node's children are already valid heaps, and only the node itself might violate the heap property. Compare the node against its two children, and if a child is 'better' (smaller, for a min-heap), swap the node down into that child's position and repeat the check one level lower — the violation gets pushed further down the tree with every swap, until the node lands somewhere it satisfies the heap property or reaches a leaf.",
        time: "O(log n) per call, proportional to the tree's height", space: "O(log n) recursion stack",
        code: `void heapify(vector<int>& heap, int n, int i) {
    int smallest = i;
    int left = 2 * i + 1, right = 2 * i + 2;

    if (left < n && heap[left] < heap[smallest]) smallest = left;
    if (right < n && heap[right] < heap[smallest]) smallest = right;

    if (smallest != i) {
        swap(heap[i], heap[smallest]);
        heapify(heap, n, smallest); // violation may have moved further down — keep sifting
    }
}`,
        variations: ["Build heap from a given Array, right below, repeatedly calls this exact heapify to fix an entire array at once.", "An iterative version replaces the recursive call with a `while` loop — same logic, no call stack."],
        gotchas: ["`heapify` only fixes a violation AT the node passed in — it assumes both children are already valid heap roots. Calling it on a node whose child ISN'T yet a valid heap silently produces a broken heap; that ordering requirement is exactly why Build Heap calls it bottom-up."]
      },
      {
        name: "Build heap from a given Array",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/building-heap-from-array/",
        idea: "A single element is trivially a valid heap — a leaf has no children to violate against. So build the whole heap bottom-up: start heapify from the LAST non-leaf node and walk backward to the root. By the time heapify runs on any given node, both of its subtrees are already guaranteed to be valid heaps — either because they were leaves already, or because an earlier iteration already fixed them — which is exactly what heapify requires to work correctly.",
        time: "O(n) overall — a tighter bound than the naive O(n log n), since most nodes are near the bottom and only sift a short distance", space: "O(log n) recursion stack",
        code: `void heapify(vector<int>& heap, int n, int i) {
    int smallest = i;
    int left = 2 * i + 1, right = 2 * i + 2;
    if (left < n && heap[left] < heap[smallest]) smallest = left;
    if (right < n && heap[right] < heap[smallest]) smallest = right;
    if (smallest != i) {
        swap(heap[i], heap[smallest]);
        heapify(heap, n, smallest);
    }
}

void buildHeap(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) { // last non-leaf node down to the root
        heapify(arr, n, i);
    }
}`,
        variations: ["Heapify above is the single-node subroutine this problem calls repeatedly.", "Building the heap by inserting elements one at a time (n calls to a sift-UP insert) also works, but costs O(n log n) instead of this bottom-up approach's O(n)."],
        gotchas: ["The loop must start at `n/2 - 1` (the LAST non-leaf node) and walk backward to 0 — starting from the front, or heapifying leaves (which have no children to fix), wastes calls or breaks the bottom-up ordering the algorithm depends on."]
      },
      {
        name: "Check if an array represents a min heap",
        difficulty: "Easy",
        link: "https://www.geeksforgeeks.org/dsa/check-if-a-given-array-represents-a-min-heap-or-not/",
        idea: "A valid min-heap needs exactly one property to hold at EVERY internal node: the node's value must be less than or equal to both of its children's values. Rather than modifying anything, just walk every internal node once and check that condition against its children — the array represents a valid min-heap if and only if it holds everywhere.",
        time: "O(n)", space: "O(1)",
        code: `bool isMinHeap(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i <= n / 2 - 1; i++) { // only internal nodes can have children to check
        int left = 2 * i + 1, right = 2 * i + 2;
        if (left < n && arr[i] > arr[left]) return false;
        if (right < n && arr[i] > arr[right]) return false;
    }
    return true;
}`,
        variations: ["The same per-node check, flipped (`arr[i] < child`), verifies a max-heap instead."],
        gotchas: ["Only internal nodes (indices `0` through `n/2 - 1`) need checking — leaves have no children, so looping all the way to `n - 1` just wastes time re-confirming nothing that ever needed checking."]
      },
      {
        name: "Heap Sort",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/heap-sort/",
        idea: "Build a max-heap out of the whole array using the same bottom-up 'Build heap' approach (comparison flipped to look for the largest), then repeatedly swap the max-heap's root — the largest remaining element — into its final sorted position at the end of the array, shrink the heap by one, and heapify the new root back into place. Doing this n times places every element into its correct sorted position, largest-to-last, entirely in place.",
        time: "O(n log n) — O(n) to build the heap, then n extractions each costing O(log n)", space: "O(1) extra (sorts in place), O(log n) recursion stack",
        code: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1, right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i); // build max-heap

    for (int end = n - 1; end > 0; end--) {
        swap(arr[0], arr[end]);      // move current max to its sorted spot
        heapify(arr, end, 0);        // restore heap property on the shrunk range
    }
}`,
        variations: ["The same build-then-repeatedly-extract idea with a MIN-heap sorts descending instead of ascending.", "K-th Largest Element in an Array, in the group below, only needs the top k extractions from this exact process, not all n — it can stop early instead of fully sorting."],
        gotchas: ["`heapify(arr, end, 0)` must be called with the SHRUNK size `end`, not the original `n` — otherwise it would re-examine already-sorted elements at the tail as if they were still part of the heap."]
      }
    ]
  },

  {
    id: "heap-insert-extract",
    name: "Insert & Extract",
    color: "#a78bfa",
    icon: "heap-insert-extract",
    trigger: "Building the heap data structure itself — supporting insertion and removal of the best element one at a time, not just a one-shot build",
    summary: "Where the group above builds a heap once from a full array, these three implement a LIVE structure that grows and shrinks: a new element sifts UP from the bottom on insert, and the root sifts back DOWN after being removed. Min-heap and max-heap are the identical class with every comparison flipped.",
    problems: [
      {
        name: "Implement Min Heap",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/implementing-min-heap-in-c/",
        idea: "Store the heap in a plain array. To INSERT, append the new value at the end (the next free leaf position) and sift it UP: repeatedly compare it against its parent and swap upward while it's smaller than its parent. To EXTRACT the minimum, it's always sitting at index 0 — swap it with the LAST element, shrink the array by one, then sift that relocated element DOWN (heapify) from the root until the heap property is restored.",
        time: "O(log n) for insert and extractMin, O(1) for getMin", space: "O(n)",
        code: `class MinHeap {
    vector<int> heap;

    void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap[parent] <= heap[i]) break;
            swap(heap[parent], heap[i]);
            i = parent;
        }
    }

    void siftDown(int i) {
        int n = heap.size();
        while (true) {
            int smallest = i, left = 2 * i + 1, right = 2 * i + 2;
            if (left < n && heap[left] < heap[smallest]) smallest = left;
            if (right < n && heap[right] < heap[smallest]) smallest = right;
            if (smallest == i) break;
            swap(heap[i], heap[smallest]);
            i = smallest;
        }
    }

public:
    void insert(int val) {
        heap.push_back(val);
        siftUp(heap.size() - 1);
    }

    int getMin() { return heap[0]; }

    void extractMin() {
        heap[0] = heap.back();
        heap.pop_back();
        if (!heap.empty()) siftDown(0);
    }
};`,
        variations: ["Implement Max Heap, right below, is the exact same class with every comparison flipped.", "C++'s `std::priority_queue<int, vector<int>, greater<int>>` already provides this — implementing it by hand is mainly for understanding what's happening underneath."],
        gotchas: ["`extractMin` moves the LAST element to the root before sifting down, rather than removing index 0 and shifting everything left — shifting the whole array would cost O(n) per extraction instead of O(log n)."]
      },
      {
        name: "Implement Max Heap",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/implementing-max-heap-in-c/",
        idea: "The exact same insert/extract skeleton as Implement Min Heap, with every comparison flipped: siftUp moves a new element up while it's LARGER than its parent, and siftDown (heapify) compares against children looking for the LARGEST rather than the smallest. The root is always the maximum instead of the minimum.",
        time: "O(log n) for insert/extractMax, O(1) for getMax", space: "O(n)",
        code: `class MaxHeap {
    vector<int> heap;

    void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap[parent] >= heap[i]) break;
            swap(heap[parent], heap[i]);
            i = parent;
        }
    }

    void siftDown(int i) {
        int n = heap.size();
        while (true) {
            int largest = i, left = 2 * i + 1, right = 2 * i + 2;
            if (left < n && heap[left] > heap[largest]) largest = left;
            if (right < n && heap[right] > heap[largest]) largest = right;
            if (largest == i) break;
            swap(heap[i], heap[largest]);
            i = largest;
        }
    }

public:
    void insert(int val) {
        heap.push_back(val);
        siftUp(heap.size() - 1);
    }

    int getMax() { return heap[0]; }

    void extractMax() {
        heap[0] = heap.back();
        heap.pop_back();
        if (!heap.empty()) siftDown(0);
    }
};`,
        variations: ["Implement Min Heap above is this exact same skeleton with every comparison flipped.", "C++'s `std::priority_queue<int>` already IS a max-heap by default."],
        gotchas: ["Every one of the four comparisons (`<=`/`>=` in siftUp, `<`/`>` in siftDown) has to flip TOGETHER to correctly turn a min-heap into a max-heap — flipping only some of them produces a structure that's neither."]
      },
      {
        name: "Convert Min Heap to Max Heap",
        difficulty: "Medium",
        link: "https://www.geeksforgeeks.org/dsa/convert-min-heap-to-max-heap/",
        idea: "The array already has every element present, just arranged to satisfy the WRONG heap property. Rather than extracting and re-inserting every element one at a time, treat the existing array as raw unordered data and run the exact same bottom-up 'Build heap' process from the group above — start from the last non-leaf node and heapify backward to the root — except every comparison now looks for the LARGEST child instead of the smallest.",
        time: "O(n)", space: "O(log n) recursion stack",
        code: `void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1, right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void convertMinToMaxHeap(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
}`,
        variations: ["Build heap from a given Array (in the group above) is the exact same bottom-up process — this problem is really 'build a max-heap', just starting from data that happens to already be arranged as a min-heap."],
        gotchas: ["It's tempting to think a min-heap is 'closer' to a max-heap than random data and could be fixed with some shortcut — it isn't. The bottom-up rebuild from scratch is still the correct, simplest approach, and it's no slower than converting genuinely random data."]
      }
    ]
  },

  {
    id: "heap-bounded-topk",
    name: "Top-K with a Heap",
    color: "#34d399",
    icon: "heap-bounded-topk",
    trigger: "Only the top k (or bottom k) elements out of many actually matter — everything else can be discarded as soon as it's proven not to make the cut",
    summary: "The exact same trick, three times: keep a heap capped at size k, and the instant it grows past k, evict its weakest member. Whatever survives after everything has been processed is the answer — no sorting the full input required. What changes between these three is only what's being ranked: raw values, a live stream instead of a fixed array, or frequency counts instead of the values themselves.",
    problems: [
      {
        name: "K-th Largest element in an array",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        idea: "Maintain a MIN-heap capped at size k. Push every element in; the instant the heap grows past size k, pop its smallest element — that guarantees only the k largest elements seen so far ever remain in the heap. Once every element has been processed, the root of this size-k min-heap is exactly the kth largest element: it's the smallest among the k largest, which is precisely what 'kth largest' means.",
        time: "O(n log k)", space: "O(k)",
        code: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap
    for (int num : nums) {
        minHeap.push(num);
        if ((int)minHeap.size() > k) minHeap.pop();
    }
    return minHeap.top();
}`,
        variations: ["Kth largest element in a stream of running integers, right below, is this exact same size-k min-heap, just kept alive across many `add()` calls instead of a single pass over a fixed array.", "Quickselect (a partition-based approach, like a partial quicksort) finds the answer in average O(n) time with O(1) extra space — faster on average, but with worse worst-case behavior than the heap."],
        gotchas: ["This finds the kth LARGEST using a MIN-heap, which can feel backwards at first — the min-heap's job is to always be ready to evict the weakest of the k survivors, not to track the largest value directly."]
      },
      {
        name: "Kth largest element in a stream of running integers",
        difficulty: "Easy",
        link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
        idea: "The exact same size-k min-heap idea as K-th Largest Element in an Array, but now it has to persist ACROSS calls instead of running once over a fixed array. Initialize the heap with the first batch of numbers (capped at k, evicting the smallest as needed), and every time `add(val)` is called, push the new value in and, if the heap now exceeds size k, pop the smallest — the root afterward is always the current kth largest.",
        time: "O(log k) per `add` call", space: "O(k)",
        code: `class KthLargest {
    priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap of size k
    int k;
public:
    KthLargest(int k, vector<int>& nums) : k(k) {
        for (int num : nums) add(num);
    }

    int add(int val) {
        minHeap.push(val);
        if ((int)minHeap.size() > k) minHeap.pop();
        return minHeap.top();
    }
};`,
        variations: ["K-th Largest Element in an Array above is the same technique applied once to a fixed array instead of maintained across a live stream."],
        gotchas: ["Routing the constructor's initial numbers through the same `add()` function (rather than duplicating the eviction logic) keeps the size-k invariant correct from the very first element, with no special-casing needed."]
      },
      {
        name: "K most frequent elements",
        difficulty: "Medium",
        link: "https://leetcode.com/problems/top-k-frequent-elements/",
        idea: "First count how often each value appears with a hash map — a completely separate step from the heap. Then apply the SAME size-k min-heap eviction pattern as the two problems above, but on (frequency, value) pairs instead of raw values: push each distinct value in ordered by its frequency, and evict the pair with the smallest frequency whenever the heap exceeds size k. What survives after processing every distinct value are the k most frequent ones.",
        time: "O(n + d log k), where d is the number of distinct elements", space: "O(d + k)",
        code: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for (int num : nums) freq[num]++;

    // min-heap ordered by frequency (smallest frequency at the top, ready to evict)
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minHeap;
    for (auto& [val, count] : freq) {
        minHeap.push({count, val});
        if ((int)minHeap.size() > k) minHeap.pop();
    }

    vector<int> res;
    while (!minHeap.empty()) {
        res.push_back(minHeap.top().second);
        minHeap.pop();
    }
    return res;
}`,
        variations: ["Bucket sort by frequency avoids the heap (and its log k factor) entirely: since frequency is bounded by n, place each value into bucket[frequency] and read off the top k buckets from the highest frequency down, for O(n) overall.", "K-th Largest Element in an Array and Kth largest element in a stream above apply this identical size-k eviction pattern directly to raw values instead of (frequency, value) pairs."],
        gotchas: ["The heap is built over DISTINCT values (from the frequency map), not over every element in the original array — pushing every occurrence individually would still work but wastes time re-processing duplicates that don't change the outcome."]
      }
    ]
  },

  {
    id: "heap-advanced",
    name: "Advanced Applications",
    color: "#f87171",
    icon: "heap-advanced",
    trigger: "One heap capped at size k isn't quite enough — the problem needs either several heap-derived structures working together, or a heap paired with a visited-set to explore candidates lazily",
    summary: "Two different advanced tricks, not one shared skeleton: lazily generating candidate pairs into a heap while guarding against revisiting the same pair twice, and splitting a stream into two balanced heaps to track a moving boundary. Both go beyond the single-bounded-heap pattern from the group above, in different directions.",
    problems: [
      {
        name: "Maximum Sum Combination",
        difficulty: "Hard",
        link: "https://www.geeksforgeeks.org/dsa/maximum-sum-combinations/",
        idea: "Sort both arrays descending — the single largest possible sum MUST be the pair of first elements, since nothing else could beat pairing the two largest values available. Push that pair into a max-heap keyed by its sum. Then repeat k times: pop the current largest sum, and push its two 'neighbors' — the next index forward in each array — as candidates for the next-largest sum, skipping any (i, j) pair already pushed before (tracked with a visited set) to avoid processing the same pair twice. This explores candidate sums roughly in decreasing order without ever generating and sorting all n^2 possible pairs.",
        time: "O(k log k) — at most O(k) heap operations, each O(log k)", space: "O(k) for the heap and visited set",
        code: `vector<int> maxCombinations(vector<int>& a, vector<int>& b, int k) {
    int n = a.size();
    sort(a.rbegin(), a.rend());
    sort(b.rbegin(), b.rend());

    // max-heap of (sum, i, j)
    priority_queue<tuple<int, int, int>> maxHeap;
    set<pair<int, int>> visited;

    maxHeap.push({a[0] + b[0], 0, 0});
    visited.insert({0, 0});

    vector<int> res;
    while (k-- > 0 && !maxHeap.empty()) {
        auto [sum, i, j] = maxHeap.top();
        maxHeap.pop();
        res.push_back(sum);

        if (i + 1 < n && !visited.count({i + 1, j})) {
            visited.insert({i + 1, j});
            maxHeap.push({a[i + 1] + b[j], i + 1, j});
        }
        if (j + 1 < n && !visited.count({i, j + 1})) {
            visited.insert({i, j + 1});
            maxHeap.push({a[i] + b[j + 1], i, j + 1});
        }
    }
    return res;
}`,
        variations: ["The identical 'push the first pair, then push its neighbors on each pop, guard with visited' technique solves 'Kth Smallest Pair Sum' and 'Find K Pairs with Smallest Sums' too, just with a min-heap and ascending sorts instead."],
        gotchas: ["Without the `visited` set, both the 'move i forward' and 'move j forward' branches can each independently rediscover and re-push the SAME (i+1, j+1) pair later on — the set is what keeps every (i, j) pair explored exactly once."]
      },
      {
        name: "Find Median from a Data Stream",
        difficulty: "Hard",
        link: "https://leetcode.com/problems/find-median-from-data-stream/",
        idea: "Split incoming numbers into a 'lower half' and an 'upper half', keeping the lower half in a MAX-heap (so its largest value sits at the top, right at the boundary) and the upper half in a MIN-heap (so its smallest value sits at the top, at the other side of the boundary). After every insertion, rebalance so the two heaps' sizes never differ by more than one. The median is then read directly off the top(s) of the heaps — no sorting, no scanning — either the max-heap's top alone (odd count) or the average of both tops (even count).",
        time: "O(log n) per `addNum`, O(1) per `findMedian`", space: "O(n)",
        code: `class MedianFinder {
    priority_queue<int> lowerHalf;                                    // max-heap
    priority_queue<int, vector<int>, greater<int>> upperHalf;         // min-heap

public:
    void addNum(int num) {
        if (lowerHalf.empty() || num <= lowerHalf.top()) lowerHalf.push(num);
        else upperHalf.push(num);

        // rebalance so sizes never differ by more than 1
        if (lowerHalf.size() > upperHalf.size() + 1) {
            upperHalf.push(lowerHalf.top());
            lowerHalf.pop();
        } else if (upperHalf.size() > lowerHalf.size()) {
            lowerHalf.push(upperHalf.top());
            upperHalf.pop();
        }
    }

    double findMedian() {
        if (lowerHalf.size() > upperHalf.size()) return lowerHalf.top();
        return (lowerHalf.top() + upperHalf.top()) / 2.0;
    }
};`,
        variations: ["Maximum Sum Combination above also reaches for a heap-based technique beyond the basic single-bounded-heap pattern, though the two problems' tricks (lazy pair expansion vs. two balanced halves) are otherwise unrelated.", "If values are known to fall within a small bounded range, a counting-array (bucket) approach can answer median queries even faster than two heaps."],
        gotchas: ["Deciding which heap a new number goes into BEFORE rebalancing (comparing it against `lowerHalf.top()`) is what keeps every element in the max-heap ≤ every element in the min-heap — rebalancing blindly by size alone, without that check, can leave a small number stuck in the upper half."]
      }
    ]
  }
];

// Quick-reference: keyword → pattern, used by the pattern finder
const TRIGGER_TABLE = [
  { keyword: "Sift a node down, build a heap bottom-up, verify, or heap sort", pattern: "heap-core-mechanics" },
  { keyword: "Implement insert/extract on a live heap from scratch", pattern: "heap-insert-extract" },
  { keyword: "Only the top k or bottom k elements matter — cap a heap at size k", pattern: "heap-bounded-topk" },
  { keyword: "Lazy pair expansion, or two heaps splitting a stream in half", pattern: "heap-advanced" }
];

  window.TOPIC_REGISTRY = window.TOPIC_REGISTRY || {};
  window.TOPIC_REGISTRY.heaps = { topic: TOPIC, patterns: PATTERNS, triggerTable: TRIGGER_TABLE };
})();