#include <bits/stdc++.h>
using namespace std;

int main() {
  int n, sum; cin >> n >> sum;
  vector<int> a(n);
  for(auto &it : a) cin >> it;
  for(int i = 0; i < n - 1; i++) {
    for(int j = i + 1; j < n; j++) {
      if(a[i] + a[j] == sum) {
        cout << i << " " << j << endl;
        return 0;
        
      }
    }
  }
  cout << "-1 -1" << endl;
  return 0;
}