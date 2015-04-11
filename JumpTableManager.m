//
//  JumpTableManager.m
//  nativeWu
//
//  Created by Sean Purcell on 4/10/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "JumpTableManager.h"
#import "JumpTable.h"

#import "RCTBridge.h"

@implementation JumpTableManager

- (UIView *)view
{
    return [[JumpTable alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

RCT_EXPORT_VIEW_PROPERTY(dataBlob, NSDictionary);

@end
