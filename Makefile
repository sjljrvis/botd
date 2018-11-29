run : clean
	clear
	node node_modules/react-native/local-cli/cli.js start

clean:
	@echo "\n -> Cleaning cache and log files\n" 
	rm -rf /tmp/metro-bundler-cache-*
	watchman watch-del-all
	@echo "\n -> Cleaning done"
	 
android:clean
	react-native run-android

ios: clean
	react-native run-ios

install :
	yarn

apk :
	cd android && ./gradlew assembleRelease
help:
	@echo "\nPlease call with one of these targets:\n"
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F:\
        '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}'\
        | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$' | xargs | tr ' ' '\n' | awk\
        '{print "    - "$$0}'
	@echo "\n"